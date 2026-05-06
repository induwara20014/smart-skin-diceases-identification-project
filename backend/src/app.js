const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const { connectMongo } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const detectRoutes = require("./routes/detect.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

// Connect DB lazily on first request to avoid "start then connect" races in dev.
let mongoConnected = false;
app.use(async (_req, _res, next) => {
  if (!mongoConnected) {
    await connectMongo();
    mongoConnected = true;
  }
  next();
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/detect", detectRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;

// Central error handler: always return JSON so frontend can show the real reason.
// (Must be after all routes.)
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const message = err?.message || "Server error";
  return res.status(500).json({ message });
});

