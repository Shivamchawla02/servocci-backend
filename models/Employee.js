import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String },
  nationality: { type: String },
  phoneMobile: { type: String },
  phoneHome: { type: String },
  email: { type: String, required: true },
  permanentAddress: { type: String },

  // Academic Info
  tenthSchool: { type: String },
  tenthBoard: { type: String },
  tenthYear: { type: String },
  tenthPercentage: { type: String },

  twelfthSchool: { type: String },
  twelfthBoard: { type: String },
  twelfthYear: { type: String },
  twelfthPercentage: { type: String },
  subjectsTaken: { type: String },

  // Institution & Course
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  intendedMajor: { type: String },
  minor: { type: String },
  preferredTerm: { type: String },

  // Financial
  scholarship: {
    type: Boolean,
    default: false,
  },

  // Emergency Contact
  emergencyContactName: { type: String },
  emergencyPhone: { type: String },
  emergencyEmail: { type: String },

  // Role
  role: {
    type: String,
    enum: ['Admin', 'Counselor'],
    default: 'Counselor',
    required: true,
  },
  counselorName: { type: String },

  communicationConsent: {
    type: Boolean,
    default: false,
  },

  documents: {
    profilePhoto: String,
    aadharCard: String,
    panCard: String,
    tenthMarksheet: String,
    twelfthMarksheet: String,
    competitiveMarksheet: String
  },

  isDocumentsSubmitted: {
    type: Boolean,
    default: false
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
