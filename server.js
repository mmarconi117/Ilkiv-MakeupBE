const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const dbConfig = require("./dbconfig");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const sendEmailRoute = require("./api/send-email");
app.use("/api/send-email", sendEmailRoute);

if (process.env.USE_DATABASE === "true") {
  sql.connect(dbConfig)
    .then(() => console.log("✅ Connected to the database"))
    .catch(err => console.error("❌ Database connection error:", err));
}

const checkDbEnabled = (req, res, next) => {
  if (process.env.USE_DATABASE !== "true") {
    return res.status(503).send("Database is disabled in alpha mode.");
  }
  next();
};

app.post("/api/register", checkDbEnabled, async (req, res) => {
  const { firstName, lastName, username, password, email } = req.body;

  if (!firstName || !lastName || !username || !password || !email)
    return res.status(400).send("First name, last name, username, password, and email are required.");
  if (password.length < 6)
    return res.status(400).send("Password must be at least 6 characters long.");
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).send("Invalid email format.");

  try {
    const result = await sql.query`
      SELECT * FROM Users WHERE Username = ${username} OR Email = ${email}
    `;
    if (result.recordset.length > 0)
      return res.status(400).send("Username or email is already taken");

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.query`
      INSERT INTO Users (FirstName, LastName, Username, Password, Email)
      VALUES (${firstName}, ${lastName}, ${username}, ${hashedPassword}, ${email})
    `;

    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error creating account");
  }
});


app.post("/api/login", checkDbEnabled, async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password)
    return res.status(400).send("Username/email and password are required.");

  try {
    const normalizedInput = loginId.toLowerCase();
    const result = await sql.query`
      SELECT * FROM Users
      WHERE LOWER(Username) = ${normalizedInput} OR LOWER(Email) = ${normalizedInput}
    `;
    const user = result.recordset[0];
    if (!user) return res.status(401).send("User not found");

    const match = await bcrypt.compare(password, user.Password);
    if (match) {
      res.send({
        message: "Login successful",
        username: user.Username,
        email: user.Email,
      });
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
});

app.post("/api/forgot-password", checkDbEnabled, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email is required.");

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await sql.query`
      SELECT * FROM Users WHERE LOWER(Email) = ${normalizedEmail}
    `;
    const user = result.recordset[0];
    if (!user) return res.status(404).send("No user found with that email.");

    const token = Math.random().toString(36).substr(2);
    await sql.query`
      UPDATE Users
      SET ResetPasswordToken = ${token}
      WHERE LOWER(Email) = ${normalizedEmail};
    `;

    const nodemailer = require("nodemailer");
    const yahooTransporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    await yahooTransporter.sendMail({
      from: process.env.YAHOO_USER,
      to: normalizedEmail,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.send("Password reset email sent.");
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).send("Error processing password reset.");
  }
});

app.post("/api/reset-password", checkDbEnabled, async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).send("Token and new password are required.");

  try {
    const result = await sql.query`
      SELECT * FROM Users WHERE ResetPasswordToken = ${token};
    `;
    const user = result.recordset[0];
    if (!user) return res.status(400).send("Invalid or expired token.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql.query`
      UPDATE Users
      SET Password = ${hashedPassword}, ResetPasswordToken = NULL
      WHERE ResetPasswordToken = ${token};
    `;
    res.send("Password has been reset successfully.");
  } catch (error) {
    res.status(500).send("Error resetting password.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
