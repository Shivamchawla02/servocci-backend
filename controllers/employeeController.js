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
      role,
      councelorName,
      communicationConsent 
    } = req.body;

    // Optional: validate required fields (you can customize this)
    if (!fullName || !dob || !email || !department || !role) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields: fullName, dob, email, department, and role."
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
      role,
      councelorName,
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
      // Admin can view all students
      employees = await Employee.find().populate('department').populate('createdBy');
    } else {
      // councelor sees only their own students
      employees = await Employee.find({ createdBy: user._id }).populate('department');
    }

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch employees" });
  }
};


const getSingleEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
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
