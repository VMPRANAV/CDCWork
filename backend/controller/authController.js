const User = require('../models/user'); 
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // Check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }
        
        // The resume file path is available from Multer in req.file
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required." });
        }

        // Convert comma-separated skills string into an array
        const skillsArray = req.body.skills ? req.body.skills.split(',').map(skill => skill.trim()) : [];

        const newUser = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            year: req.body.year,
            department: req.body.department,
            cgpa: req.body.cgpa,
            arrears: req.body.arrears,
            codingLinks: req.body.codingLinks,
            skills: skillsArray,
            resume: req.file.path // Store the path to the uploaded file
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // --- NEW: Send back the token and user data ---
        res.status(201).json({
        status: 'success',
        message: "User registered successfully!",
        token,
        data: {
            id: savedUser._id,
            name: savedUser.fullName,
            email: savedUser.email,
            role: savedUser.role,
            codingLinks: savedUser.codingLinks
        }
    });

    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Server error during registration." });
    }

};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // 2. Check if user exists and get the password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Check if the password is correct
        // We use the comparePassword method we defined in the user model
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. If everything is ok, send a token to the client
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });

        res.status(200).json({
            status: 'success',
            token,
            data: { // Send some user data back if you want
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                codingLinks: user.codingLinks
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};