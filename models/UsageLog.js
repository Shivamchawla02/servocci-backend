import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Councellor', required: true },
  sessionDuration: { type: Number, required: true }, // duration in seconds (consistent with frontend)
  timestamp: { type: Date, required: true }, // timestamp when session ended or logged
  // Optional start and end time fields if you want detailed tracking:
  startTime: Date,
  endTime: Date,
}, { timestamps: true });

const UsageLog = mongoose.model("UsageLog", usageLogSchema);
export default UsageLog;
