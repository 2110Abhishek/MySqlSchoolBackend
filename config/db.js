import mysql from "mysql2";

const db = mysql.createConnection({
  host: "centerbeam.proxy.rlwy.net", // from Railway
  port: 21735,                        // use the Railway port, NOT 3306
  user: "root",                      // check Railway → Variables
  password: "OPcTmwNWGCwEWHbVfQvAFVCZlzUvHIFr",         // Railway MySQL password
  database: "railway"                // usually 'railway' unless you renamed
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ DB Connected Successfully!");
  }
});

export default db;
