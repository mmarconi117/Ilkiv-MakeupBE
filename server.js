// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();

// const allowed = [
//   "https://ilkivmakeup.vercel.app",
//   "http://localhost:5173"
// ];
// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin) return cb(null, true);                 // curl/Postman
//     if (allowed.includes(origin)) return cb(null, true);
//     return cb(new Error("Not allowed by CORS"));
//   },
//   methods: ["POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());

// app.post("/api/send-email", async (req, res) => {
//   const { name, email, message } = req.body;
//   if (!name || !message) return res.status(400).json({ error: "Name and message are required" });

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.mail.yahoo.com",
//       port: 465,
//       secure: true,
//       auth: { user: process.env.YAHOO_USER, pass: process.env.YAHOO_PASS }
//     });

//     await transporter.sendMail({
//       from: process.env.YAHOO_USER,
//       to: process.env.RECIPIENT_EMAIL || process.env.YAHOO_USER,
//       subject: `New Message from ${name}`,
//       text: `Name: ${name}\nEmail: ${email || "Not provided"}\n\n${message}`
//     });

//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (err) {
//     console.error("send-email:", err);
//     res.status(500).json({ error: "Error sending email" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Email server listening on ${PORT}`));
