import multer from "multer";
import path from "path";
import Councellor from "../models/Councellor.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import UsageLog from '../models/UsageLog.js';

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add Councellor Controller
const addCouncellor = async (req, res) => {
  try {
    const {
      name,
      phone,
      aadhaar,
      pan,
      username,
      gst,
      password,
      confirmPassword,
      role,
      email,
    } = req.body;

    // ✅ Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already registered",
      });
    }

    // ✅ Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ Create User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // ✅ Generate UNIQUE 4-digit counsellorCode
    let counsellorCode;
    let exists = true;

    while (exists) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      const found = await Councellor.findOne({ counsellorCode: randomCode });

      if (!found) {
        counsellorCode = randomCode;
        exists = false;
      }
    }

    // ✅ Create Counsellor (ONLY include fields if they exist)
    const newCouncellor = new Councellor({
      userId: savedUser._id,
      name,
      email,
      password: hashPassword,
      role: role || "councelor",
      counsellorCode,

      ...(phone && { phone }),
      ...(aadhaar && { aadhaar }),
      ...(pan && { pan }),
      ...(username && { username }),
      ...(gst && { gst }),
    });

    await newCouncellor.save();

    return res.status(200).json({
      success: true,
      message: "Counsellor created successfully!",
      counsellor: newCouncellor,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    // ✅ Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(400).json({
        success: false,
        error: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Server error in adding counsellor",
    });
  }
};


const getAllCouncellors = async (req, res) => {
  try {
    const councellors = await Councellor.find().populate("userId", "email profileImage");
    res.status(200).json({ success: true, data: councellors });
  } catch (error) {
    console.error("Error fetching councellors:", error);
    res.status(500).json({ success: false, error: "Server error while fetching councellors" });
  }
};

const getCouncellorCount = async (req, res) => {
  try {
    const count = await Councellor.countDocuments({ role: 'councellor' }); // ✅ filter by role
    res.status(200).json({ totalCouncellors: count });
  } catch (error) {
    console.error("Error counting councellors:", error);
    res.status(500).json({ success: false, error: "Server error in counting councellors" });
  }
};

const getCouncellorById = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const councellor = await Councellor.findById(req.params.id)
      .populate("userId", "email profileImage");

    if (!councellor) {
      return res.status(404).json({ success: false, message: "Councellor not found" });
    }

    // Build date filter for UsageLog
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      // To include the entire endDate day, set time to end of day
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      dateFilter.$lte = endDateObj;
    }

    const matchStage = {
  counselorId: councellor.userId._id,
};
    if (startDate || endDate) {
      matchStage.timestamp = dateFilter;
    }

    const usageSummary = await UsageLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$counselorId",
          totalDuration: { $sum: "$sessionDuration" },
          sessionCount: { $sum: 1 },
          lastSession: { $max: "$timestamp" },
          avgDuration: { $avg: "$sessionDuration" },
        },
      },
    ]);

    const summary = usageSummary[0] || {
      totalDuration: 0,
      sessionCount: 0,
      lastSession: null,
      avgDuration: 0,
    };

    // Remove password or sensitive fields from councellor object
    const { password, ...councellorData } = councellor.toObject();

    res.status(200).json({
      success: true,
      data: {
        ...councellorData,
        usageSummary: summary,
      },
    });
  } catch (error) {
    console.error("Error fetching councellor by ID:", error);
    res.status(500).json({ success: false, message: "Server error while fetching councellor" });
  }
};



const getCouncellorByUserId = async (req, res) => {
  try {
    const councellor = await Councellor.findOne({ userId: req.params.userId }).populate("userId", "email profileImage");
    if (!councellor) {
      return res.status(404).json({ success: false, message: "Councellor not found" });
    }
    res.status(200).json({ success: true, data: councellor });
  } catch (error) {
    console.error("Error fetching councellor by userId:", error);
    res.status(500).json({ success: false, message: "Server error while fetching councellor" });
  }
};



export { addCouncellor, upload, getAllCouncellors, getCouncellorCount, getCouncellorById, getCouncellorByUserId };
