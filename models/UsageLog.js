import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema({
  counselorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sessionDuration: { type: Number },
  timestamp: { type: Date },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
}, { timestamps: true });

const UsageLog = mongoose.model("UsageLog", usageLogSchema);
export default UsageLog;
