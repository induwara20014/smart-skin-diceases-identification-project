const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Account, ACCOUNT_ROLES } = require("../models/Account");
const { requireFields, normalizeEmail } = require("../utils/validators");
const { asyncHandler } = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function signToken(account) {
  return jwt.sign(
    { id: account._id.toString(), role: account.role, districtName: account.districtName || "" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const err = requireFields(req.body, ["name", "email", "password"]);
    if (err) return res.status(400).json({ message: err });

    const role = "user";

    const email = normalizeEmail(req.body.email);
    const existing = await Account.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(String(req.body.password), 10);

    const account = await Account.create({
      name: String(req.body.name).trim(),
      email,
      passwordHash,
      role,
      districtName: String(req.body.districtName || "").trim()
    });

    return res.status(201).json({
      message: "Registered successfully",
      account: { id: account._id, role: account.role, districtName: account.districtName }
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const err = requireFields(req.body, ["email", "password"]);
    if (err) return res.status(400).json({ message: err });

    const email = normalizeEmail(req.body.email);
    const account = await Account.findOne({ email });
    if (!account) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(req.body.password), account.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: "JWT_SECRET missing" });

    const token = signToken(account);
    return res.json({
      token,
      account: { id: account._id, role: account.role, districtName: account.districtName }
    });
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const account = await Account.findById(req.user.id).select("-passwordHash");
    if (!account) return res.status(404).json({ message: "Account not found" });
    return res.json({ account });
  })
);

module.exports = router;

