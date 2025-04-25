import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(404).json({ success: false, error: "Wrong Password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify Authenticated Route
const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // fetch full user details without password

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to verify user" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    });

    res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id; // assumes JWT middleware sets req.user

    const user = await User.findById(userId).select("-password"); // Don't return password
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
};

export { login, verify, forgotPassword, resetPassword, getMyProfile };
