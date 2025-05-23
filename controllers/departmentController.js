import Department from "../models/Department.js";

// Get all departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Get department server error" });
    }
};

// Add a new department
const addDepartment = async (req, res) => {
    try {
        const { 
            course_name, 
            dep_name, 
            specialization, 
            duration, 
            eligibility, 
            fees, 
            description, 
            state,
            place,
            logo
        } = req.body;

        // Only require these fields:
        if (!course_name || !dep_name || !state || !place) {
            return res.status(400).json({ success: false, error: "course_name, dep_name, state, and place are required" });
        }

        const newDep = new Department({
            course_name,
            dep_name,
            specialization,
            duration,
            eligibility,
            fees,
            description,
            state,
            place,
            logo
        });

        await newDep.save();
        return res.status(201).json({ success: true, department: newDep });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Add department server error" });
    }
};


// Get total department count
const getDepartmentCount = async (req, res) => {
    try {
        const count = await Department.countDocuments();
        return res.status(200).json({ totalDepartments: count });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Count department server error" });
    }
};

export { addDepartment, getDepartments, getDepartmentCount };
