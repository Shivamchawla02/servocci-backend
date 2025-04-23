import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    dep_name: { type: String, required: true },
    specialization: { type: String },
    duration: { type: String, required: true },
    eligibility: { type: String, required: true },
    fees: { type: Number, required: true },
    description: { type: String },
    place: { type: String, required: true },
    state: { type: String, required: true },
    logo: { type: String }, // ✅ Add this field to store the image URL
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  

// Removed website_url field

const Department = mongoose.model("Department", departmentSchema);

export default Department;
