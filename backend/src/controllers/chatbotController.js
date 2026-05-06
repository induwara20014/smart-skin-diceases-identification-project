// controllers/chatbotController.js
const { getPythonChatReply } = require("../services/chatbot.service");
const Disease = require("../models/Disease");

const sessions = {};

exports.chat = async (req, res) => {
  const { userId, message, diseaseLabel } = req.body;
  if (!sessions[userId]) sessions[userId] = [];

  sessions[userId].push({ role: "user", text: message });

  const disease = diseaseLabel
    ? await Disease.findOne({ name: { $regex: diseaseLabel, $options: "i" } })
    : await Disease.findOne({ name: { $regex: message, $options: "i" } });

  const reply = await getPythonChatReply({
    message,
    disease,
    chatHistory: sessions[userId],
  });

  sessions[userId].push({ role: "bot", text: reply });

  res.json({ reply, disease: disease?.name || null });
};