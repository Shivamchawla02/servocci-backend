import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Councellor', required: true },
  sessionDuration: { type: Number }, // duration in seconds, set when session ends
  timestamp: { type: Date }, // session end timestamp, set when session ends
  startTime: { type: Date, required: true }, // session start time, set when session starts
  endTime: { type: Date }, // session end time, set when session ends
}, { timestamps: true });

const UsageLog = mongoose.model("UsageLog", usageLogSchema);
export default UsageLog;
