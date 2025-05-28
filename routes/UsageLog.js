import express from "express";
import UsageLog from "../models/UsageLog.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT and get user info
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/", authenticate, async (req, res) => {
  const { counselorId, sessionDuration, timestamp } = req.body;

  // Security check: counselorId in body should match logged-in user or admin
  if (req.user.role !== "admin" && req.user._id !== counselorId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const log = new UsageLog({
      counselorId,
      sessionDuration,
      timestamp,
    });

    await log.save();
    res.status(201).json({ message: "Usage log saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save usage log" });
  }
});

export default router;
