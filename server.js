// const express = require("express");
// const cors = require("cors");
// const sendEmailRoute = require("./send-mail");
// require("dotenv").config();

// const app = express();
// app.use(express.json());

// // Allow frontend origins
// const allowedOrigins = [
//   "https://ilkivmakeup.vercel.app",
//   "http://localhost:5173"
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error("Not allowed by CORS"), false);
//   },
//   methods: ["GET", "POST", "OPTIONS"],
//   credentials: true
// }));

// // Handle preflight manually
// app.options("*", cors());

// // Routes
// app.use("/api/send-email", sendEmailRoute);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
