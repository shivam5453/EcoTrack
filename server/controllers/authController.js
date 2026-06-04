const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'ecotrack_jwt_access_secret_2026';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'ecotrack_jwt_refresh_secret_2026';

// Helper to generate access and refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken, rememberMe = false) => {
  const secure = process.env.NODE_ENV === 'production';

  const accessOptions = [
    `access_token=${accessToken}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=900',
    'SameSite=None'
  ];

  if (secure) accessOptions.push('Secure');

  const refreshOptions = [
    `refresh_token=${refreshToken}`,
    'HttpOnly',
    'Path=/',
    'SameSite=None'
  ];

  if (rememberMe) {
    refreshOptions.push(`Max-Age=${7 * 24 * 60 * 60}`);
  }

  if (secure) refreshOptions.push('Secure');

  res.setHeader('Set-Cookie', [
    accessOptions.join('; '),
    refreshOptions.join('; ')
  ]);
};
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with default settings
    const user = await User.create({
      name,
      email,
      passwordHash,
      settings: {
        theme: 'light',
        units: 'kg',
        notifications: true
      }
    });

    // Generate credentials tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set standard cookies
    setAuthCookies(res, accessToken, refreshToken, false);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & generate tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate credentials tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set cookies, handling remember me checkbox
    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookies
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    // Clear authorization cookies by setting Max-Age=0
    res.setHeader('Set-Cookie', [
      'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure'
    ]);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh expired access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refresh = async (req, res, next) => {
  try {
    // Custom cookie parser utility
    const parseCookies = (cookieHeader) => {
      const cookies = {};
      if (!cookieHeader) return cookies;
      cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        if (parts.length >= 2) {
          cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
        }
      });
      return cookies;
    };

    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User profile not found.' });
    }

    // Generate new Access and Refresh tokens
    const tokens = generateTokens(user._id);

    // Keep active rememberMe status
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, true);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    res.setHeader('Set-Cookie', [
      'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure'
    ]);
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' });
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh
};
