const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "centerbeam.proxy.rlwy.net", // Railway public host
  port: 21735,                        // Railway port
  user: "root",                       // Railway user
  password: "OPcTmwNWGCwEWHbVfQvAFVCZlzUvHIFr", // Railway password
  database: "railway"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ DB Connected Successfully!");
  }
});

module.exports = db;
