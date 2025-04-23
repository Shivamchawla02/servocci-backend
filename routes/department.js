import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDepartment,
  getDepartments,
  getDepartmentCount
} from '../controllers/departmentController.js';
import Department from '../models/Department.js';

const router = express.Router();

router.get('/', authMiddleware, getDepartments);
router.post('/add', authMiddleware, addDepartment);

// NEW: Count departments
router.get('/count', authMiddleware, getDepartmentCount);

router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, department });
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUT /api/department/:id/logo - Update department logo
router.put('/:id/logo', authMiddleware, async (req, res) => {
  try {
    const { logoUrl } = req.body;

    if (!logoUrl) {
      return res.status(400).json({ success: false, message: 'Logo URL is required' });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { logo: logoUrl },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    console.error('Error updating logo:', error);
    res.status(500).json({ success: false, message: 'Server error while updating logo' });
  }
});


export default router;
