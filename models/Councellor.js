import mongoose, { Schema } from "mongoose";

const councellorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    required: true,
    unique: true,
    trim: true,
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
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
    enum: ['councellor', 'admin'],
    default: 'councellor',
  },
  counsellorCode: {
  type: String,
  required: true,
  unique: true,
  match: /^\d{4}$/,
},
}, {
  timestamps: true // Automatically handles createdAt & updatedAt
});

const Councellor = mongoose.model("Councellor", councellorSchema);
export default Councellor;
