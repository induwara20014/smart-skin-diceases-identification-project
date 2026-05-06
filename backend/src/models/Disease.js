const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, default: "" },
    symptoms: { type: [String], default: [] },
    precautions: { type: [String], default: [] },
    treatments: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Disease", DiseaseSchema);

