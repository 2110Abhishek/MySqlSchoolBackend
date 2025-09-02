// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// Routes
const schoolRoutes = require("./routes/schoolRoutes");
app.use("/api/schools", schoolRoutes);

// Listen on Railway port
const PORT = process.env.PORT || 5000; // ONLY for server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
