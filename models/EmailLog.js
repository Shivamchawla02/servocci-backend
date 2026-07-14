import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    to: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    body: {
      type: String,
    },

    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },

    type: {
      type: String,
      default: "Custom",
    },

    resendId: String,

    error: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EmailLog", EmailLogSchema);