// api/send-email.js — Vercel serverless function (Yahoo)
import nodemailer from "nodemailer";

const allowed = new Set([
  "https://ilkivmakeup.vercel.app", // your prod frontend
  "http://localhost:5173",          // vite dev
]);

function withCors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  withCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end(); // preflight OK
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body || {};
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
      to: process.env.RECIPIENT_EMAIL || process.env.YAHOO_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email || "Not provided"}\n\n${message}`,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("send-email:", err);
    return res.status(500).json({ error: "Error sending email" });
  }
}
