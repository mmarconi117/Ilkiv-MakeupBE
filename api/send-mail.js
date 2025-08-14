// api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // 1. Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://ilkivmakeup.vercel.app"); // frontend URL
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2. Handle preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, message } = req.body;
  if (!name || !message)
    return res.status(400).json({ error: "Name and message are required" });

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
    console.error(err);
    res.status(500).json({ error: "Error sending email" });
  }
}
