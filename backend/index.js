const express = require("express");
const { PORT , MONGO_URL } = require('./.config/config');
const mongoose = require("mongoose")
const cors = require('cors');
const path = require('path');
const { startRoundProcessing } = require('./services/roundProcessing.service');


// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const applicationRoutes = require('./routes/application.routes');
const postRoutes = require('./routes/post.routes');
const jobRoutes = require('./routes/job.routes');
const departmentRoutes = require('./routes/department.route.js');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();

// --- Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Make the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

main().catch(err => console.error(err));

async function main() {
    await mongoose.connect(MONGO_URL);
    startRoundProcessing();
}


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/rounds', attendanceRoutes);

app.listen(PORT);
