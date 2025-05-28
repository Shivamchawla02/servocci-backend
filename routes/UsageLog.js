import express from "express";
import UsageLog from "../models/UsageLog.js";

const router = express.Router();

// Public route — no authentication required for usage logging
router.post("/", async (req, res) => {
  const { counselorId, sessionDuration, timestamp } = req.body;

  // Basic validation (optional)
  if (!counselorId || !sessionDuration || !timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
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
    console.error("Error saving usage log:", err);
    res.status(500).json({ error: "Failed to save usage log" });
  }
});

export default router;
