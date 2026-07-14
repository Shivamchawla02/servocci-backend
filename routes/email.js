import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  sendStudentEmail,
  getStudentEmails,
} from "../controllers/emailController.js";

const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  sendStudentEmail
);

router.get(
  "/:employeeId",
  authMiddleware,
  getStudentEmails
);

export default router;