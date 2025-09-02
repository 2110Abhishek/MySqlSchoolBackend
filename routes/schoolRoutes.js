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
  async (req, res) => {
    try {
      const { name, address, city, state, contact, email_id } = req.body;
      const image = req.files["image"] ? req.files["image"][0].filename : null;
      const resume = req.files["resume"] ? req.files["resume"][0].filename : null;

      const sql =
        "INSERT INTO schools (name, address, city, state, contact, email_id, image, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      const [result] = await db.execute(
        sql,
        [name, address, city, state, contact, email_id, image, resume]
      );
      
      res.json({ message: "School added successfully", id: result.insertId });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Get all schools
router.get("/", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM schools");
    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// Get single school by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.execute("SELECT * FROM schools WHERE id = ?", [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// Update school
router.put(
  "/:id",
  upload.fields([{ name: "image" }, { name: "resume" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, city, state, contact, email_id } = req.body;
      const image = req.files["image"] ? req.files["image"][0].filename : null;
      const resume = req.files["resume"] ? req.files["resume"][0].filename : null;

      const sql =
        "UPDATE schools SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=COALESCE(?, image), resume=COALESCE(?, resume) WHERE id=?";
      
      await db.execute(
        sql,
        [name, address, city, state, contact, email_id, image, resume, id]
      );
      
      res.json({ message: "School updated successfully" });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: "Database update failed" });
    }
  }
);

// Delete school
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM schools WHERE id = ?", [id]);
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database delete failed" });
  }
});

module.exports = router;