const mongoose = require("mongoose");

const ACCOUNT_ROLES = ["user"];

const AccountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ACCOUNT_ROLES },
    districtName: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

module.exports = {
  Account: mongoose.model("Account", AccountSchema),
  ACCOUNT_ROLES
};

