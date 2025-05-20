import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addCouncellor,
  upload,
  getAllCouncellors,
  getCouncellorCount,
  getCouncellorById, // 👈 add this too
  getCouncellorByUserId
} from '../controllers/councellorController.js';

const router = express.Router();

// Add Councellor
router.post('/add', authMiddleware, upload.single('image'), addCouncellor);

// Get all Councellors
router.get('/list', authMiddleware, getAllCouncellors);

// ✅ Get total number of Councellors
router.get('/count', authMiddleware, getCouncellorCount);

router.get('/:id', authMiddleware, getCouncellorById);

router.get('/byUserId/:userId', authMiddleware, getCouncellorByUserId);

export default router;
