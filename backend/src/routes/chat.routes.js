const express = require("express");

const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { asyncHandler } = require("../utils/asyncHandler");

const { getPythonChatReply  } = require("../services/chatbot.service");

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireRole(["user", "doctor", "admin"]),
  asyncHandler(async (req, res) => {
    const { message, diseaseLabel, chatHistory } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "message is required" });
    }
    const reply = await getPythonChatReply({ 
      message: String(message), 
      disease: diseaseLabel ? String(diseaseLabel) : null,
      chatHistory: chatHistory || []
    });
    return res.json(reply);
  })
);

module.exports = router;

