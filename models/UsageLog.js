import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Councelor', required: true },
  sessionDuration: { type: Number, required: true }, // in ms
  timestamp: { type: Date, required: true },
  startTime: Date,
  endTime: Date,
}, { timestamps: true });

const UsageLog = mongoose.model("UsageLog", usageLogSchema);
export default UsageLog;
