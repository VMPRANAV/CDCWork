const mongoose = require('mongoose');
const User = require('./models/user.js');
const Job = require('./models/job.model.js');

async function testEligibility() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/CDCWork', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check existing students
    const students = await User.find({ role: 'student' });
    console.log(`Found ${students.length} students:`);
    students.forEach((s, i) => {
      console.log(`${i+1}. ${s.fullName} (${s.dept}) - Complete: ${s.isProfileComplete}, CGPA: ${s.ugCgpa}, Year: ${s.passoutYear}`);
    });

    // Check existing jobs
    const jobs = await Job.find({});
    console.log(`\nFound ${jobs.length} jobs:`);
    jobs.forEach((j, i) => {
      console.log(`${i+1}. ${j.jobTitle} - Eligible students: ${j.eligibleStudents?.length || 0}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testEligibility();
