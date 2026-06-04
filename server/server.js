const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// CORS configuration supporting credentials (cookies transfer)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.DOCKER_CLIENT_URL || 'http://localhost'
];

app.use(cors({
  origin: function (origin, callback) {

    console.log("CLIENT_URL =", process.env.CLIENT_URL);
    console.log("ALLOWED_ORIGINS =", allowedOrigins);
    console.log("REQUEST_ORIGIN =", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error('The CORS policy for this site does not allow access from the specified Origin.'),
        false
      );
    }

    console.log("CORS ALLOWED:", origin);

    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Baseline healthcheck ping
app.get('/api/ping', (req, res) => {
  res.json({
    success: true,
    message: 'EcoTrack API Server is running',
    timestamp: new Date()
  });
});

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/carbon', require('./routes/carbonRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EcoTrack Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
