// backend/config/db.js

const mysql = require("mysql2");
require("dotenv").config(); // Load .env variables if running locally

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ DB Connected Successfully!");
  }
});

module.exports = db;
