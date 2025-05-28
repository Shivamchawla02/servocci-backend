import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionDuration: { type: Number, required: true }, // duration in milliseconds
  timestamp: { type: Date, default: Date.now },
});

const UsageLog = mongoose.model("UsageLog", usageLogSchema);
export default UsageLog;
