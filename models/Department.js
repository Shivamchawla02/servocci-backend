import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  course_name: { type: String },
  dep_name: { type: String, required: true }, // Only this field is required
  specialization: { type: String },
  duration: { type: String },
  eligibility: { type: String },
  fees: { type: Number },
  description: { type: String },
  place: { type: String },
  state: { type: String },
  logo: { type: String }, // Optional image URL
  brochure: {
    type: String,
    default: ''
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
