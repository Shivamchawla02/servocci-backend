import multer from "multer";
import path from "path";
import Councellor from "../models/Councellor.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
      role,
      email,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered in CMS" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Save User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // Save Councellor (don't forget email here!)
    const newCouncellor = new Councellor({
      userId: savedUser._id,
      name,
      email, // ✅ include email
      phone,
      aadhaar,
      pan,
      username,
      gst,
      password: hashPassword,
      role,
    });

    await newCouncellor.save();

    return res
      .status(200)
      .json({ success: true, message: "Councellor created successfully!" });
  } catch (error) {
    console.error("Error adding Councellor:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error in adding councellor" });
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
    const count = await Councellor.countDocuments({ role: 'councelor' }); // ✅ filter by role
    res.status(200).json({ totalCouncellors: count });
  } catch (error) {
    console.error("Error counting councellors:", error);
    res.status(500).json({ success: false, error: "Server error in counting councellors" });
  }
};

const getCouncellorById = async (req, res) => {
  try {
    const councellor = await Councellor.findById(req.params.id).populate("userId", "email profileImage");
    if (!councellor) {
      return res.status(404).json({ success: false, message: "Councellor not found" });
    }

    res.status(200).json({ success: true, data: councellor });
  } catch (error) {
    console.error("Error fetching councellor by ID:", error);
    res.status(500).json({ success: false, message: "Server error while fetching councellor" });
  }
};



export { addCouncellor, upload, getAllCouncellors, getCouncellorCount, getCouncellorById };
