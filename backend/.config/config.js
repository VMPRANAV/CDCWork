const dotenv = require("dotenv");
const path = require("path");

// Resolve path to .env file located in the backend directory
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

const MONGO_URL = process.env.MONGO_URL || process.env.MongoDBURL || null;
const PORT = process.env.PORT || 3002;
const JWT_USER_SECRET = process.env.JWT_USER_SECRET || process.env.JWT_SECRET || null;
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET || null;

module.exports = { MONGO_URL, PORT , JWT_USER_SECRET, JWT_ADMIN_SECRET};
