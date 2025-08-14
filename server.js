const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://ilkivmakeup.vercel.app", // frontend
  "http://localhost:5173"           // local dev
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Handle preflight requests manually (sometimes needed)
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Routes
const sendEmailRoute = require("./send-mail");
app.use("/api/send-email", sendEmailRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
