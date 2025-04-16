import express from 'express';
import {
  login,
  verify,
  forgotPassword,
  resetPassword,
  getMyProfile
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);
router.get('/me', authMiddleware, getMyProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
