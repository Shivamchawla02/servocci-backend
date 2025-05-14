import mongoose, { Schema } from "mongoose";

const councellorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  
  phone: {
    type: String,
    unique: true,
    trim: true,
  },
  aadhaar: {
    type: String,
    unique: true,
    trim: true,
  },
  pan: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  gst: {
    type: String,
    default: '',
    uppercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['councelor', 'admin'],
    default: 'councelor',
  },
  counsellorCode: {
    type: String,
    unique: true,
    match: /^\d{4}$/,
  },
}, {
  timestamps: true
});

const Councellor = mongoose.model("Councellor", councellorSchema);
export default Councellor;
