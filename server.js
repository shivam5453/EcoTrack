// EcoTrack Database Server - Express & Mongoose Integration

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// Configure CORS to support local development and direct file loading (origin is null)
app.use(cors({
    origin: function (origin, callback) {
        // Allows requests from any client browser or local file loading
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// Serve static frontend files from this directory
app.use(express.static(__dirname));

// ============================================================================
// DATABASE CONNECTION (MongoDB)
// ============================================================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB database.'))
    .catch(err => {
        console.error('Error connecting to MongoDB. Please ensure MongoDB is running!');
        console.error(err.message);
    });

// ============================================================================
// MONGOOSE MODELS & SCHEMAS
// ============================================================================

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    profileData: {
        type: Object,
        default: {
            householdSize: 2,
            electricity: 300,
            gridType: 'avg',
            heatingType: 'gas',
            heatingUsage: 400,
            carDistance: 10000,
            carType: 'petrol',
            transitDistance: 50,
            flightsShort: 2,
            flightsLong: 1,
            dietType: 'average',
            recyclePaper: true,
            recyclePlastic: true,
            recycleGlass: false,
            recycleMetal: false,
            wasteLevel: 'low',
            activeStep: 1,
            actions: {
                led: false,
                solar: false,
                transit: false,
                veggie: false,
                dry: false,
                smart: false
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

// ============================================================================
// JWT AUTHORIZATION MIDDLEWARE
// ============================================================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Sign in required.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
        }
        req.user = decodedUser;
        next();
    });
};

// ============================================================================
// API ENDPOINTS / CONTROLLERS
// ============================================================================

// Ping endpoint (Client uses to detect if server is running)
app.get('/api/ping', (req, res) => {
    res.json({ success: true, status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const normalizedUsername = username.trim().toLowerCase();
        if (normalizedUsername.length < 3) {
            return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });
        }
        if (password.length < 4) {
            return res.status(400).json({ success: false, message: 'Password must be at least 4 characters.' });
        }

        // Check if username already exists in database
        const existingUser = await User.findOne({ username: normalizedUsername });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username is already taken.' });
        }

        // Hash password before saving to DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        const newUser = new User({
            username: normalizedUsername,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'Registration successful! You can now sign in.' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const normalizedUsername = username.trim().toLowerCase();

        // Find User
        const user = await User.findOne({ username: normalizedUsername });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Incorrect username or password.' });
        }

        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect username or password.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' } // Keep user logged in for 7 days
        );

        res.json({
            success: true,
            message: `Welcome back, ${user.username}!`,
            token,
            user: {
                username: user.username,
                profileData: user.profileData
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// Save Calculator State Endpoint
app.post('/api/profile/save', authenticateToken, async (req, res) => {
    try {
        const { profileData } = req.body;
        
        if (!profileData) {
            return res.status(400).json({ success: false, message: 'No profile data received.' });
        }

        // Save data to User collection
        await User.findByIdAndUpdate(req.user.userId, { profileData });
        res.json({ success: true, message: 'Calculator state saved successfully in MongoDB.' });
    } catch (err) {
        console.error('Save Profile Error:', err);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// Load Calculator State Endpoint
app.get('/api/profile/load', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User profile not found.' });
        }
        res.json({ success: true, profileData: user.profileData });
    } catch (err) {
        console.error('Load Profile Error:', err);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// Fallback index.html router for SPA direct load
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// LAUNCH SERVER
// ============================================================================

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`  EcoTrack Server is running on port ${PORT}`);
    console.log(`  Local Address: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
