import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDepartment,
  getDepartments,
  getDepartmentCount
} from '../controllers/departmentController.js';
import Department from '../models/Department.js';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// File upload config (Cloudinary)
const upload = multer({ dest: 'temp/' });

router.get('/', authMiddleware, getDepartments);
router.post('/add', authMiddleware, addDepartment);
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

// Update department logo
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

// Upload brochure
router.put('/:id/brochure', authMiddleware, upload.single('brochure'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No brochure file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'servocci/brochures',
      public_id: `department-${req.params.id}-brochure`,
      overwrite: true
    });

    fs.unlinkSync(req.file.path);

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { brochure: result.secure_url },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    console.error('Error uploading brochure:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading brochure' });
  }
});

// ✅ NEW: Upload fee structure
router.put('/:id/fee-structure', authMiddleware, upload.single('fee_structure'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No fee structure file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'servocci/fee_structures',
      public_id: `department-${req.params.id}-fee-structure`,
      overwrite: true
    });

    fs.unlinkSync(req.file.path);

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { fee_structure: result.secure_url },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    console.error('Error uploading fee structure:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading fee structure' });
  }
});

export default router;
