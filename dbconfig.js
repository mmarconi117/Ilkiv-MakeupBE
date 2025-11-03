require("dotenv").config();

const config = {
  user: process.env.DB_USER || "SA",
  password: process.env.DB_PASSWORD || "reallyStrongPwd123",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "IlkivMakeup",
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

module.exports = config;
