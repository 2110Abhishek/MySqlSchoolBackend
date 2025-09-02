// backend/config/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool instead of single connection for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true
});

// Get a promise wrapped version of the pool
const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
  .then(connection => {
    console.log("✅ DB Connected Successfully!");
    connection.release();
  })
  .catch(err => {
    console.error("❌ DB Connection Failed:", err.message);
  });

module.exports = promisePool;