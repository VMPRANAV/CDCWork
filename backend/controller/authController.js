const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { firstName, middleName, lastName, collegeEmail, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !collegeEmail || !password) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ collegeEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Construct fullName
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

        // Create new user (only with the fields from the signup form)
        const user = await User.create({
            firstName,
            middleName,
            lastName,
            fullName,
            collegeEmail,
            password,
            // All other fields will use defaults or be empty as per the schema
        });

        // Generate token
        const token = generateToken(user._id);

        // Don't send password back
        user.password = undefined;

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            data: user
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { collegeEmail, password } = req.body;

    // 1. Check if collegeEmail and password exist
    if (!collegeEmail || !password) {
        return res.status(400).json({ message: 'Please provide your college email and password.' });
    }

    try {
        // 2. Check if user exists and password is correct
        // We explicitly select the password because it's excluded by default in the schema
        const user = await User.findOne({ collegeEmail }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        
        // 3. If everything is ok, send token to client
        const token = generateToken(user._id);

        // Remove password from the output
        user.password = undefined;

        res.status(200).json({
            message: 'Login successful!',
            token,
            data: user
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};