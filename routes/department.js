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

export default router;
