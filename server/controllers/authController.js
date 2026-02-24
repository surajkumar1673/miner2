const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    // Check DB Connection
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ msg: 'Database is not connected. Please check your MongoDB Altas IP Whitelist settings.' });
    }
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.name });
            }
        );
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    // Check DB Connection
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ msg: 'Database is not connected. Please check your MongoDB Altas IP Whitelist settings.' });
    }
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.name });
            }
        );
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error('Get Doctors Error:', err.message);
        res.status(500).json({ msg: 'Server error fetching doctors' });
    }
};

exports.healthCheck = async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        status: 'ok',
        database: states[dbState] || 'unknown',
        time: new Date().toISOString()
    });
};
