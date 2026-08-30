const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyJwt } = require("../../middleware/auth");

const router = express.Router();

// Ensure uploads directory exists
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
const uploadDir = isVercel ? "/tmp/uploads/receipts" : path.join(__dirname, "../../public/uploads/receipts");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create uploadDir:", e);
  }
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "receipt-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to only allow images/PDF
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

router.post("/receipt", verifyJwt, upload.single("receipt"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded or invalid file format" });
  }
  
  // The static route serves public/uploads as /uploads
  const fileUrl = `/uploads/receipts/${req.file.filename}`;
  
  res.status(200).json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

const bonafideDir = isVercel ? "/tmp/uploads/bonafides" : path.join(__dirname, "../../public/uploads/bonafides");
if (!fs.existsSync(bonafideDir)) {
  try {
    fs.mkdirSync(bonafideDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create bonafideDir:", e);
  }
}

const bonafideStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bonafideDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "bonafide-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadBonafide = multer({
  storage: bonafideStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

router.post("/bonafide", verifyJwt, uploadBonafide.single("bonafide"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded or invalid file format" });
  }
  
  const fileUrl = `/uploads/bonafides/${req.file.filename}`;
  
  res.status(200).json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

module.exports = router;
