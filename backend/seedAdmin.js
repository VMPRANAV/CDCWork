const {MONGO_URL} = require('./.config/config')

const mongoose = require("mongoose");
const readline = require("readline/promises");
const Admin = require('./models/admin');
const User = require('./models/user');

const MONGO = MONGO_URL || "mongodb://127.0.0.1:27017/CDCWork";

async function seedStudents() {
  console.log('Seeding test students...');

  const testStudents = [
    {
      firstName: 'John',
      lastName: 'Doe',
      collegeEmail: 'john.doe@kpriet.ac.in',
      password: 'password123',
      role: 'student',
      dept: 'CSE',
      passoutYear: 2026,
      ugCgpa: 8.5,
      currentArrears: 0,
      isProfileComplete: true,
      education: {
        tenth: { percentage: 90, board: 'CBSE', passingYear: 2020 },
        twelth: { percentage: 85, passingYear: 2022 }
      }
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      collegeEmail: 'jane.smith@kpriet.ac.in',
      password: 'password123',
      role: 'student',
      dept: 'IT',
      passoutYear: 2026,
      ugCgpa: 7.2,
      currentArrears: 1,
      isProfileComplete: true,
      education: {
        tenth: { percentage: 88, board: 'State', passingYear: 2020 },
        twelth: { percentage: 82, passingYear: 2022 }
      }
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      collegeEmail: 'bob.johnson@kpriet.ac.in',
      password: 'password123',
      role: 'student',
      dept: 'CSE',
      passoutYear: 2025, // Different year
      ugCgpa: 6.8,
      currentArrears: 0,
      isProfileComplete: true,
      education: {
        tenth: { percentage: 75, board: 'CBSE', passingYear: 2019 },
        twelth: { percentage: 70, passingYear: 2021 }
      }
    },
    {
      firstName: 'Alice',
      lastName: 'Brown',
      collegeEmail: 'alice.brown@kpriet.ac.in',
      password: 'password123',
      role: 'student',
      dept: 'ECE',
      passoutYear: 2026,
      ugCgpa: 9.1,
      currentArrears: 2,
      isProfileComplete: false, // Incomplete profile
      education: {
        tenth: { percentage: 95, board: 'ICSE', passingYear: 2020 },
        twelth: { percentage: 90, passingYear: 2022 }
      }
    }
  ];

  for (const studentData of testStudents) {
    try {
      const existingStudent = await User.findOne({ collegeEmail: studentData.collegeEmail });
      if (existingStudent) {
        console.log(`Student ${studentData.collegeEmail} already exists`);
        continue;
      }

      const student = new User(studentData);
      await student.save();
      console.log(`Created student: ${student.fullName} (${student.dept})`);
    } catch (error) {
      console.error(`Error creating student ${studentData.collegeEmail}:`, error.message);
    }
  }

  console.log('Student seeding completed!');
}

async function main() {
  // connect
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const args = process.argv.slice(2);
  if (args.includes('--seed-students')) {
    await seedStudents();
    await mongoose.disconnect();
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const choice = await rl.question("What do you want to do? (admin/students): ");
    
    if (choice === 'students') {
      rl.close();
      await seedStudents();
      return;
    }

    const collegeEmail = await rl.question("Admin email: ");
    const password = await rl.question("Password (visible): ");

    rl.close();

    const response = await Admin.findOne({collegeEmail});
    if(response ){
        console.log("Admin already Exist");
        return;
    }


    const admin = new Admin({
        collegeEmail,
        password,
        role : "admin"
    })

    await admin.save();

    console.log("Admin user created/updated:", {
      id: admin._id,
      name: admin.name,
      collegeEmail: admin.collegeEmail,
      role: admin.role,
    });
  } catch (e) {
    rl.close();
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
