const express = require("express");

const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { asyncHandler } = require("../utils/asyncHandler");

const DetectionRecord = require("../models/DetectionRecord");

const router = express.Router();

router.get(
  "/disease-map",
  authenticate,
  requireRole("user"),
  asyncHandler(async (req, res) => {
    // We aggregate by districtName and predictedLabel to get accurate counts
    const data = await DetectionRecord.aggregate([
      {
        $match: {
          districtName: { $ne: "" },
          predictedLabel: { $ne: "" }
        }
      },
      {
        $group: {
          _id: { district: "$districtName", disease: "$predictedLabel" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          district: "$_id.district",
          disease: "$_id.disease",
          count: 1
        }
      }
    ]);

    return res.json(data);
  })
);

module.exports = router;
