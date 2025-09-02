const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables

// Create DB connection using Railway-provided variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,    // e.g., centerbeam.proxy.rlwy.net
  port: process.env.DB_PORT,    // e.g., 21735
  user: process.env.DB_USER,    // e.g., root
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ DB Connected Successfully!");
  }
});

module.exports = db;
