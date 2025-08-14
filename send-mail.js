// send-mail.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.YAHOO_USER,
      to: process.env.YAHOO_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email || "Not provided"}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Error sending email" });
  }
});

module.exports = router;
