const express = require('express');
const { MONGO_URL, PORT } = require('./.config/config');
const mongoose = require("mongoose")
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoutes');

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
    await mongoose.connect(MONGO_URL);
}


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
