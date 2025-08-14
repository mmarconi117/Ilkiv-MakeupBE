const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Allow your frontend domain (production) and localhost for dev
const allowedOrigins = [
  "https://ilkivmakeup.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like curl or postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Preflight handling
app.options("*", cors());

// Routes
const sendEmailRoute = require("./send-mail");
app.use("/api/send-email", sendEmailRoute);

module.exports = app; // if using serverless Vercel function
