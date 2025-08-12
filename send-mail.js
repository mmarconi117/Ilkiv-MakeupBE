// send-email.js
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const YAHOO_USER = process.env.YAHOO_USER;
const YAHOO_PASS = process.env.YAHOO_PASS;

// Optional auth middleware — only verifies if token exists
const optionalVerifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Invalid token — silently skip
  }
  next();
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  auth: {
    user: YAHOO_USER,
    pass: YAHOO_PASS,
  },
});

// Route: Send Email
router.post("/", optionalVerifyJWT, async (req, res) => {
  const { name, email: formEmail, message } = req.body;

  if (!name || !message) {
    return res.status(400).send("Name and message are required.");
  }

  const replyToEmail = req.user?.email || formEmail;
  if (!replyToEmail) {
    return res.status(400).send("Reply-to email is required.");
  }

  const mailOptions = {
    from: YAHOO_USER,
    to: YAHOO_USER,
    subject: `New Message from ${name} via Website`,
    text: `Name: ${name}\nEmail: ${formEmail || "Not provided"}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SMTP response:", error.response);
    }
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
