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

// ✅ GET: Status Summary (placed before /:id to avoid routing conflict)
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

router.get('/lead-summary', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({}, 'leadStatus');

    const summary = {
      qualified: 0,
      followUp: 0,
      initiated: 0,
      received: 0,
      documentation: 0,
      closed: 0,
      rejected: 0,
      unqualified: 0,
    };

    employees.forEach(emp => {
      const status = emp.leadStatus?.trim(); // Remove whitespace if any

      if (['Lead Open', 'Call Not Picked', 'Call Back'].includes(status)) {
        summary.qualified += 1;
      } else if (['Switch Off / Wrong No.'].includes(status)) {
        summary.unqualified += 1;
      } else if (status === 'Follow Up') {
        summary.followUp += 1;
      } else if (status === 'Admission Initiated') {
        summary.initiated += 1;
      } else if (status === 'Documentation Done') {
        summary.documentation += 1;
      } else if (status === 'Application Received') {
        summary.received += 1;
      } else if (status === 'Application Rejected') {
        summary.rejected += 1;
      } else if (status === 'Admission Closed') {
        summary.closed += 1;
      }
    });

    res.json(summary);
  } catch (err) {
    console.error('Error in lead-summary route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
router.put('/:id/lead-status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { leadStatus } = req.body;

  try {
    const updated = await Employee.findByIdAndUpdate(
      id,
      { leadStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Lead status updated', employee: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/remarks', authMiddleware, employeeController.updateRemarks);

export default router;
