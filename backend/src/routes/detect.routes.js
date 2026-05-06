const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { asyncHandler } = require("../utils/asyncHandler");

const { Account } = require("../models/Account");
const Disease = require("../models/Disease");
const DetectionRecord = require("../models/DetectionRecord");

const { inferFromImage } = require("../services/inference.service");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}_${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post(
  "/",
  authenticate,
  requireRole("user"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "image file is required (field name: image)" });

    const user = await Account.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await inferFromImage(req.file.path);
    const predictedLabel = String(result.label || "Unknown").trim();
    const confidence = Number.isFinite(result.confidence) ? result.confidence : 0;

    const disease = await Disease.findOne({
      name: { $regex: `^${predictedLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
    });

    const record = await DetectionRecord.create({
      userId: user._id,
      districtName: user.districtName || "",
      diseaseId: disease?._id || null,
      predictedLabel,
      confidence,
      imagePath: req.file.path
    });

    return res.json({
      recordId: record._id,
      predictedLabel,
      confidence,
      disease: disease
        ? {
            id: disease._id,
            name: disease.name,
            description: disease.description,
            symptoms: disease.symptoms,
            precautions: disease.precautions,
            treatments: disease.treatments
          }
        : null
    });
  })
);

module.exports = router;

