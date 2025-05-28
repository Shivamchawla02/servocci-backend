import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addCouncellor,
  upload,
  getAllCouncellors,
  getCouncellorCount,
  getCouncellorById,
  getCouncellorByUserId
} from '../controllers/councellorController.js';

const router = express.Router();

// Add Councellor
router.post('/add', authMiddleware, upload.single('image'), addCouncellor);

// Get all Councellors
router.get('/list', authMiddleware, getAllCouncellors);

// ✅ Get total number of Councellors
router.get('/count', authMiddleware, getCouncellorCount);

// Important: place more specific route before dynamic ':id' param route
router.get('/byUserId/:userId', authMiddleware, getCouncellorByUserId);

router.get('/:id', authMiddleware, getCouncellorById);

export default router;
