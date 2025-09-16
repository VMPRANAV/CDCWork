const User = require('../models/user'); 

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
            resume: req.file.path
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            status: 'success',
            message: "User registered successfully!",
            data: {
                id: savedUser._id,
                name: savedUser.fullName,
                email: savedUser.email,
                role: savedUser.role,
                codingLinks: savedUser.codingLinks
            }
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt for:', email);

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // ✅ Simple response - no token needed
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                department: user.department,
                year: user.year,
                cgpa: user.cgpa,
                codingLinks: user.codingLinks
            }
        });

        console.log('Login successful for:', email);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during login." });
    }
};