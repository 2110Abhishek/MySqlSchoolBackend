// backend/routes/schoolRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db"); // Import from config

const router = express.Router();

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Route: Add school with image + resume
router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "resume" }]),
  (req, res) => {
    const { name, address, city, state, contact, email_id } = req.body;
    const image = req.files["image"] ? req.files["image"][0].filename : null;
    const resume = req.files["resume"] ? req.files["resume"][0].filename : null;

    const sql =
      "INSERT INTO schools (name, address, city, state, contact, email_id, image, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      sql,
      [name, address, city, state, contact, email_id, image, resume],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "School added successfully", id: result.insertId });
      }
    );
  }
);

// Get all schools
router.get("/", (req, res) => {
  db.query("SELECT * FROM schools", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(results);
  });
});

// Get single school by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM schools WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    if (results.length === 0)
      return res.status(404).json({ error: "School not found" });
    res.json(results[0]);
  });
});

// Update school
router.put(
  "/:id",
  upload.fields([{ name: "image" }, { name: "resume" }]),
  (req, res) => {
    const { id } = req.params;
    const { name, address, city, state, contact, email_id } = req.body;

    const image = req.files["image"] ? req.files["image"][0].filename : null;
    const resume = req.files["resume"] ? req.files["resume"][0].filename : null;

    const sql =
      "UPDATE schools SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=COALESCE(?, image), resume=COALESCE(?, resume) WHERE id=?";
    db.query(
      sql,
      [name, address, city, state, contact, email_id, image, resume, id],
      (err, result) => {
        if (err) {
          console.error("Update Error:", err);
          return res.status(500).json({ error: "Database update failed" });
        }
        res.json({ message: "School updated successfully" });
      }
    );
  }
);

// Delete school
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM schools WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database delete failed" });
    }
    res.json({ message: "School deleted successfully" });
  });
});

module.exports = router;