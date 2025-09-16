const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose")
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3002;

//when i used the process.env here it didnt worked will check during atlas connection.
const MongoDBURL = "mongodb://127.0.0.1:27017/CDCWork";

// Import routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/application.routes');

const app = express();

// --- Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Make the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

main()
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MongoDBURL);
}


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
