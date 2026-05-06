const mongoose = require("mongoose");

const DetectionRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    districtName: { type: String, default: "", trim: true },
    diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Disease", default: null },

    predictedLabel: { type: String, default: "" },
    confidence: { type: Number, default: 0 },
    imagePath: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetectionRecord", DetectionRecordSchema);

