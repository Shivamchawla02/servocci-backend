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

    // ✅ Updated required fields check
    if (!fullName || !phoneMobile) {
      return res.status(400).json({
        success: false,
        error: "Please provide both fullName and phoneMobile."
      });
    }

    const newEmployee = new Employee({
      fullName,
      dob,
      gender,
      nationality,
      phoneMobile,
      phoneHome,
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
      department,
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
    res.status(201).json({ success: true, message: "Employee added successfully!" });

  } catch (error) {
    console.error("Add Employee Error:", error);
    res.status(500).json({ success: false, error: "Failed to add employee" });
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

export default {
  addEmployee,
  getAllEmployees,
  getSingleEmployee,
  getEmployeeCount
};
