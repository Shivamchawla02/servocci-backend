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
  sparse: true,
},

aadhaar: {
  type: String,
  unique: true,
  sparse: true,
},

pan: {
  type: String,
  unique: true,
  sparse: true,
},

username: {
  type: String,
  unique: true,
  sparse: true,
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
  enum: ['admin', 'manager', 'councelor'],
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
