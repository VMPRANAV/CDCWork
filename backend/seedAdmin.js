const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const MongoDBURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/CDCWork";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MongoDBURL);
        console.log("MongoDB connected for seeding.");

        const adminEmail = 'admin@kpriet.ac.in';

        // Check if the admin user already exists
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists.');
            return;
        }

        // If not, create the admin user
        const adminData = {
            fullName: 'Placement Officer',
            email: adminEmail,
            password: 'Secure!23', // This will be hashed automatically
            role: 'admin',
            year: '1',
            department: 'CSE',
            cgpa: '5.5',
            arrears: '0',
            resume: 'uploads\\resume-1757853076394-212833179.pdf',
            codingLinks: 'https://gemini.google.com/app/70432ae744c506b5',
            skills: [ 'MERN', 'DSA' ]
        };

        const newAdmin = new User(adminData);
        await newAdmin.save();
        console.log('Admin user created successfully!');

    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

// Run the seeder function
seedAdmin();