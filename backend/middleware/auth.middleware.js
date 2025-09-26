const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const Admin = require("../models/admin.model.js"); // Add this import
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

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_USER_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    try {
      decoded = jwt.verify(token, JWT_ADMIN_SECRET);
      req.user = await Admin.findById(decoded.id).select("-password");
    } catch (err2) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // Check if user exists after database lookup
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user not found" });
  }

  next();
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Add null check for req.user
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user?.role || "unknown"}' is not authorized to access this route.`,
      });
    }
    next();
  };
};