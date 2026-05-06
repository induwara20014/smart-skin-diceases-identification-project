const express = require("express");

const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { asyncHandler } = require("../utils/asyncHandler");

const DetectionRecord = require("../models/DetectionRecord");

const router = express.Router();

router.get(
  "/detections",
  authenticate,
  requireRole("user"),
  asyncHandler(async (req, res) => {
    const records = await DetectionRecord.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("diseaseId", "name description symptoms precautions treatments");

    return res.json({
      records: records.map((r) => ({
        id: r._id,
        predictedLabel: r.predictedLabel,
        confidence: r.confidence,
        createdAt: r.createdAt,
        disease: r.diseaseId
      }))
    });
  })
);

router.get(
  "/dashboard",
  authenticate,
  requireRole("user"),
  asyncHandler(async (req, res) => {
    // Minimal dashboard: show history.
    const recentRecords = await DetectionRecord.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("diseaseId", "name description symptoms precautions treatments");

    return res.json({
      recentRecords
    });
  })
);

module.exports = router;
