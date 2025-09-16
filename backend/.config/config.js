const dotenv = require("dotenv");
const path = require("path");

// Resolve path to .env file located in the backend directory
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

const MONGO_URL = process.env.MONGO_URL || null;
const PORT = process.env.PORT || 3002;

module.exports = { MONGO_URL , PORT};