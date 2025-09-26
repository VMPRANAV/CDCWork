require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Configuration
const MONGO_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/CDCWork';

// Import test students data
const { testStudents } = require('./testStudentsData');

/**
 * Seed students into the database
 */
async function seedStudents() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing students
    console.log('🧹 Clearing existing students...');
    await User.deleteMany({ role: 'student' });
    console.log('✅ Cleared existing students');

    // Hash passwords and prepare students
    console.log('🔨 Preparing student data...');
    const studentsWithHashedPasswords = await Promise.all(
      testStudents.map(async (student) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(student.password, salt);
        return {
          ...student,
          password: hashedPassword,
          isProfileComplete: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    // Insert students
    console.log('📥 Inserting students...');
    const result = await User.insertMany(studentsWithHashedPasswords);
    console.log(`✅ Successfully inserted ${result.length} students`);

    // Close connection
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    
    return {
      success: true,
      count: result.length
    };
  } catch (error) {
    console.error('❌ Error seeding students:', error);
    await mongoose.disconnect();
    throw error;
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedStudents()
    .then(result => {
      console.log(`🎉 Successfully seeded ${result.count} students`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed to seed students:', error);
      process.exit(1);
    });
}

// Export for testing or programmatic use
module.exports = {
  seedStudents
};
