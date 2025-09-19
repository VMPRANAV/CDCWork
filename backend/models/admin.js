const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    collegeEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.]+@kpriet\.ac\.in$/,
        "Please use your official KPRIET email.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      select: false, // Prevents password from being sent in queries by default
    },
    role: {
      type: String,
      default: "admin", // Default role admin
    },
  },
  {
    // This option adds `createdAt` and `updatedAt` fields automatically
    timestamps: true,
  }
);

adminSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;