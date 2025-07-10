import Employee from '../models/Employee.js';

const addEmployee = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      gender,
      nationality,
      phoneMobile,
      phoneHome,
      parentMobile,   // ✅ NEW
      email,
      permanentAddress,
      aadhaarNumber,
      regNumber,      // ✅ NEW
      fatherName,     // ✅ NEW
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
      preferredTerm,
      scholarship,
      emergencyContactName,
      emergencyPhone,
      emergencyEmail,
      communicationConsent 
    } = req.body;

    if (!fullName || !phoneMobile) {
      return res.status(400).json({
        success: false,
        error: "Please provide both fullName and phoneMobile for the student."
      });
    }

    const newEmployee = new Employee({
      fullName,
      dob,
      gender,
      nationality,
      phoneMobile,
      phoneHome,
      parentMobile,        // ✅ ADDED
      regNumber,           // ✅ ADDED
      fatherName,          // ✅ ADDED
      email,
      permanentAddress,
      aadhaarNumber,
      tenthSchool,
      tenthBoard,
      tenthYear,
      tenthPercentage,
      twelfthSchool,
      twelfthBoard,
      twelfthYear,
      twelfthPercentage,
      subjectsTaken,
      department: department || undefined,
      intendedMajor,
      minor,
      preferredTerm,
      scholarship,
      emergencyContactName,
      emergencyPhone,
      emergencyEmail,
      communicationConsent,
      createdBy: req.user._id
    });

    await newEmployee.save();
    res.status(201).json({
      success: true,
      message: "Student added successfully!",
      student: newEmployee
    });

  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ success: false, error: "Failed to add student" });
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


export default {
  addEmployee,
  getAllEmployees,
  getSingleEmployee,
  getEmployeeCount,
  updateLeadStatus,
  updateRemarks,
  leadSummary,
  updateEmployee, // ✅ ADD THIS
};
