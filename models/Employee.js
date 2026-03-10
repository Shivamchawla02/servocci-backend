import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  regNumber: { type: String },
  fatherName: { type: String },
  dob: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  phoneMobile: { type: String, required: true },
  parentMobile: { type: String },
  email: { type: String },
  permanentAddress: { type: String },
  aadhaarNumber: { type: String },

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

  // ✅ IMPORTANT FIX
  // Changed from ObjectId → String
  department: {
    type: String
  },

  intendedMajor: { type: String },
  minor: { type: String },
  preferredTerm: { type: String },

  scholarship: {
    type: Boolean,
    default: false,
  },

  emergencyContactName: { type: String },
  emergencyPhone: { type: String },
  emergencyEmail: { type: String },

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

  // ✅ FIXED (No longer required)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // ✅ FIXED ENUM + DEFAULT
  leadStatus: {
    type: String,
    enum: [
      'Pre Admission',
      'Lead Open',
      'Call Not Picked',
      'Call Back',
      'Switch Off / Wrong No.',
      'Follow Up',
      'Admission Initiated',
      'Application Received',
      'Documentation Done',
      'Admission Closed',
      'Application Rejected'
    ],
    default: 'Pre Admission'
  },

  remarks: {
    type: String,
    default: ''
  }

}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;