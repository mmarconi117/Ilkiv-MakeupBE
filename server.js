// server.js (Alpha email-only backend)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://ilkivmakeup.vercel.app", // your frontend
  "http://localhost:5173"           // local dev
];


app.use(cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true,
}));

// Import email route
const sendEmailRoute = require("./send-mail");
app.use("/api/send-email", sendEmailRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
