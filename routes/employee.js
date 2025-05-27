import express from 'express';
import employeeController from '../controllers/employeeController.js';
import { uploadDocuments } from '../controllers/documentController.js';
import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Employee from '../models/Employee.js'; // ✅ Import the model

const router = express.Router();

// POST: Add Employee
router.post('/add', authMiddleware, employeeController.addEmployee);

// GET: Get all Employees
router.get('/all', authMiddleware, employeeController.getAllEmployees);

// GET: Get Employee Count
router.get('/count', authMiddleware, employeeController.getEmployeeCount);

// GET: Status Summary (kept as is)
router.get('/status-summary', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();

    const total = employees.length;

    const approved = employees.filter(emp => {
      const docs = emp.documents || {};
      return docs.profilePhoto && docs.aadharCard && docs.panCard &&
             docs.tenthMarksheet && docs.twelfthMarksheet && docs.competitiveMarksheet;
    }).length;

    const pending = total - approved;

    // Future optional rejected logic
    const rejected = 0;

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    console.error('Error in status-summary route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Use controller method for lead-summary with role-based filtering
router.get('/lead-summary', authMiddleware, employeeController.leadSummary);

// GET: Get Single Employee by ID
router.get('/:id', authMiddleware, employeeController.getSingleEmployee);

// POST: Upload Documents
router.post(
  '/:id/upload-documents',
  authMiddleware,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'tenthMarksheet', maxCount: 1 },
    { name: 'twelfthMarksheet', maxCount: 1 },
    { name: 'competitiveMarksheet', maxCount: 1 }
  ]),
  uploadDocuments
);

// PUT /api/employees/:id/lead-status
router.put('/:id/lead-status', authMiddleware, employeeController.updateLeadStatus);


router.put('/:id/remarks', authMiddleware, employeeController.updateRemarks);

export default router;
