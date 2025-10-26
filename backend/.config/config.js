const dotenv = require("dotenv");
const path = require("path");
const cloudinary = require('cloudinary').v2;

// Resolve path to .env file located in the backend directory
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

const MONGO_URL = process.env.MONGO_URL || process.env.MongoDBURL || null;
const PORT = process.env.PORT || 3002;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET || process.env.JWT_SECRET || null;
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET || null;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { 
  MONGO_URL, 
  PORT, 
  JWT_USER_SECRET, 
  JWT_ADMIN_SECRET,
  cloudinary,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
