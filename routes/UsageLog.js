import express from "express";
import mongoose from "mongoose";
import UsageLog from "../models/UsageLog.js";

const router = express.Router();

// Start session - create UsageLog with startTime only
router.post("/start", async (req, res) => {
  const { counselorId } = req.body;
  if (!counselorId) {
    return res.status(400).json({ error: "Missing counselorId" });
  }

  try {
    const newLog = new UsageLog({
      counselorId,
      startTime: new Date(),
    });

    const savedLog = await newLog.save();
    res.status(201).json({ message: "Session started", usageLogId: savedLog._id });
  } catch (err) {
    console.error("Error starting session:", err);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// End session - update UsageLog with endTime, sessionDuration and timestamp
router.post("/end", async (req, res) => {
  const { usageLogId } = req.body;
  if (!usageLogId) {
    return res.status(400).json({ error: "Missing usageLogId" });
  }

  try {
    const log = await UsageLog.findById(usageLogId);
    if (!log) {
      return res.status(404).json({ error: "UsageLog not found" });
    }

    log.endTime = new Date();
    log.sessionDuration = Math.floor((log.endTime - log.startTime) / 1000); // seconds
    log.timestamp = log.endTime; // timestamp is set as session end time

    await log.save();

    res.status(200).json({ message: "Session ended", sessionDuration: log.sessionDuration });
  } catch (err) {
    console.error("Error ending session:", err);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// Get total usage time for a counselor
router.get("/total-time/:counselorId", async (req, res) => {
  const { counselorId } = req.params;

  try {
    const logs = await UsageLog.find({ counselorId, sessionDuration: { $ne: null } });

    const totalSeconds = logs.reduce((sum, log) => sum + (log.sessionDuration || 0), 0);

    res.status(200).json({
      totalSeconds,
      totalMinutes: Math.floor(totalSeconds / 60),
      totalHours: (totalSeconds / 3600).toFixed(2),
    });
  } catch (err) {
    console.error("Error calculating total usage time:", err);
    res.status(500).json({ error: "Failed to calculate total usage time" });
  }
});

router.get("/daily-usage/:counselorId", async (req, res) => {
  try {
    const { counselorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(counselorId)) {
      return res.status(400).json({ error: "Invalid counselorId" });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyUsage = await UsageLog.aggregate([
      {
        $match: {
          counselorId: new mongoose.Types.ObjectId(counselorId),
          sessionDuration: { $ne: null },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          totalDuration: { $sum: "$sessionDuration" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(dailyUsage);
  } catch (err) {
    console.error("Error fetching daily usage:", err);
    res.status(500).json({ error: "Failed to fetch daily usage" });
  }
});

// Get all sessions for a counselor
router.get("/sessions/:counselorId", async (req, res) => {
  try {
    const { counselorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(counselorId)) {
      return res.status(400).json({ error: "Invalid counselorId" });
    }

    const sessions = await UsageLog.find({ counselorId })
      .sort({ startTime: -1 }); // newest first

    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;
