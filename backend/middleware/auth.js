const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

exports.protect = async (req, res, next) => {
    let token;

    console.log('=== AUTHENTICATION MIDDLEWARE ===');
    console.log('Authorization header:', req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token extracted:', token ? 'Yes' : 'No');
        console.log('Token length:', token ? token.length : 0);
    }

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        console.log('JWT_SECRET exists:', process.env.JWT_SECRET ? 'Yes' : 'No');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);

        req.user = await User.findById(decoded.id).select('-password');
        console.log('User found:', req.user ? 'Yes' : 'No');
        if (req.user) {
            console.log('User role:', req.user.role);
            console.log('User ID:', req.user._id);
        }

        console.log('=== AUTHENTICATION SUCCESS ===');
        next();
    } catch (error) {
        console.error('=== AUTHENTICATION ERROR ===');
        console.error('JWT verification error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('=== AUTHORIZATION CHECK ===');
        console.log('Required roles:', roles);
        console.log('User role:', req.user?.role);

        if (!roles.includes(req.user.role)) {
            console.log('Authorization failed');
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route.`
            });
        }
        console.log('Authorization successful');
        next();
    };
};

// Simple session-based auth - no JWT needed

exports.requireLogin = (req, res, next) => {
    // For now, just pass through - you can add session logic later if needed
    console.log('Auth check - allowing access');
    next();
};

exports.requireAdmin = (req, res, next) => {
    // Simple admin check - you can enhance this later
    console.log('Admin check - allowing access');
    next();
};