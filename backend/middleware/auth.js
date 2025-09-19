const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const Admin = require("../models/admin.js"); // Add this import
const { JWT_USER_SECRET, JWT_ADMIN_SECRET } = require("../.config/config.js");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    if (req.headers.role === "user") {
      const decoded = jwt.verify(token, JWT_USER_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } else {
      const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
      // Use Admin model instead of User model for admin authentication
      req.user = await Admin.findById(decoded.id).select("-password");
    }

    // Check if user exists after database lookup
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Add null check for req.user
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
