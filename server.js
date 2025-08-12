// server.js (Alpha email-only backend)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Import email route
const sendEmailRoute = require("./send-mail");
app.use("/api/send-email", sendEmailRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
