const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("District", DistrictSchema);

