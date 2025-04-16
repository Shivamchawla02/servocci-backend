import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No token provided",
      });
    }

    const token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded || !decoded._id) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware/route
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error: " + error.message,
    });
  }
};

export default verifyUser;
