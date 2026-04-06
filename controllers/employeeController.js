import Employee from '../models/Employee.js';

const addEmployee = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      nationality,
      phoneMobile,
      parentMobile,
      email,
      permanentAddress,
      aadhaarNumber,
      regNumber,
      fatherName,
      tenthSchool,
      tenthBoard,
      tenthYear,
      tenthPercentage,
      twelfthSchool,
      twelfthBoard,
      twelfthYear,
      twelfthPercentage,
      subjectsTaken,
      department,
      intendedMajor,
      minor,
      scholarship,
      preferredTerm,
      emergencyContactName,
      emergencyPhone,
      emergencyEmail,
      communicationConsent,
    } = req.body;

    // 🔥 AUTO SET createdBy
    const createdBy = req.user?.id || req.user?._id;

    const newEmployee = new Employee({
      fullName,
      dob,
      gender,
      nationality,
      phoneMobile,
      parentMobile,
      email,
      permanentAddress,
      aadhaarNumber,
      regNumber,
      fatherName,
      tenthSchool,
      tenthBoard,
      tenthYear,
      tenthPercentage,
      twelfthSchool,
      twelfthBoard,
      twelfthYear,
      twelfthPercentage,
      subjectsTaken,
      department,
      intendedMajor,
      minor,
      scholarship,
      preferredTerm,
      emergencyContactName,
      emergencyPhone,
      emergencyEmail,
      communicationConsent,

      // ✅ KEY LINE
      createdBy
    });

    await newEmployee.save();

    return res.status(200).json({
      success: true,
      message: "Student added successfully",
      employee: newEmployee,
    });

  } catch (error) {
    console.error("Add Employee Error:", error);

    // Handle duplicate errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};


const getAllEmployees = async (req, res) => {
  try {
    const user = req.user;
    let employees;

    if (user.role === 'admin') {
      employees = await Employee.find()
        .populate('department')
        .populate('createdBy', 'name email');
    } else {
      employees = await Employee.find({ createdBy: user._id })
        .populate('department');
    }

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch employees" });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .populate('createdBy', 'name email');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeCount = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    res.status(200).json({ totalEmployees: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count employees' });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { leadStatus } = req.body;
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { leadStatus },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee: updated });
  } catch (err) {
    console.error("Error updating lead status:", err);
    res.status(500).json({ success: false, message: 'Failed to update lead status' });
  }
};

const leadSummary = async (req, res) => {
  try {
    const user = req.user;

    // Role-based filtering
    const query = user.role === 'admin' ? {} : { createdBy: user._id };

    const employees = await Employee.find(query, 'leadStatus');

    // Initialize counts
    const summary = {
      Qualified: 0,
      "Follow-up": 0,
      Initiated: 0,
      Received: 0,
      Documentation: 0,
      Closed: 0,
      Rejected: 0,
      Unqualified: 0,
    };

    employees.forEach(emp => {
      const status = (emp.leadStatus || '').trim();

      if (['Lead Open', 'Call Not Picked', 'Call Back'].includes(status)) {
        summary.Qualified += 1;
      } else if (status === 'Switch Off / Wrong No.') {
        summary.Unqualified += 1;
      } else if (status === 'Follow Up') {
        summary["Follow-up"] += 1;
      } else if (status === 'Admission Initiated') {
        summary.Initiated += 1;
      } else if (status === 'Documentation Done') {
        summary.Documentation += 1;
      } else if (status === 'Application Received') {
        summary.Received += 1;
      } else if (status === 'Application Rejected') {
        summary.Rejected += 1;
      } else if (status === 'Admission Closed') {
        summary.Closed += 1;
      } else {
        // If no match, count as Unqualified or skip
        summary.Unqualified += 1;
      }
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error in leadSummary:", error);
    res.status(500).json({ message: "Failed to generate lead summary" });
  }
};

export const updateRemarks = async (req, res) => {
  try {
    const { remarks } = req.body;
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { remarks },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, employee: updated });
  } catch (err) {
    console.error("Error updating remarks:", err);
    res.status(500).json({ success: false, message: 'Failed to update remarks' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Accepts all fields from the frontend
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, student: updatedEmployee });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({ success: false, message: 'Failed to update student' });
  }
};

const checkMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const existing = await Employee.findOne({
      phoneMobile: mobile,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        exists: true,
        employee: existing,
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
    });

  } catch (error) {
    console.error("Check mobile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const publicDocumentUpload = async (req, res) => {
  try {
    const {
      fullName,
      phoneMobile,
      email,
      counsellorCode,
      documents,
      leadStatus
    } = req.body;

    if (!fullName || !phoneMobile) {
      return res.status(400).json({
        success: false,
        message: "Full name and mobile are required"
      });
    }

    // ✅ Prevent duplicate mobile
    const existing = await Employee.findOne({ phoneMobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists"
      });
    }

    // ✅ Find counsellor by code
    let createdBy = null;

    if (counsellorCode) {
      const Counsellor = (await import('../models/Councellor.js')).default;

      const counsellor = await Counsellor.findOne({
        counsellorCode
      });

      if (counsellor) {
        createdBy = counsellor.userId; // adjust if your field differs
      }
    }

    const newEmployee = new Employee({
      fullName,
      phoneMobile,
      email,
      documents,
      leadStatus: leadStatus || "Application Received",
      createdBy
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Documents submitted successfully",
      employee: newEmployee
    });

  } catch (error) {
    console.error("Public Document Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export default {
  addEmployee,
  getAllEmployees,
  getSingleEmployee,
  getEmployeeCount,
  updateLeadStatus,
  updateRemarks,
  leadSummary,
  updateEmployee,
  checkMobile,
  publicDocumentUpload // ✅ ADD THIS
};
