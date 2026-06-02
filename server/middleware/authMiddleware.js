const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Custom Cookie Parser helper
 * Parses raw Cookie header string into key-value pairs.
 */
const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      cookies[name] = decodeURIComponent(val);
    }
  });
  return cookies;
};

const protect = async (req, res, next) => {
  // Parse cookies from request headers
  const cookies = parseCookies(req.headers.cookie);
  const accessToken = cookies.access_token;
  const refreshToken = cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ success: false, message: 'Access denied. Please login.' });
  }

  try {
    // 1. Validate Access Token if present
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || 'ecotrack_jwt_access_secret_2026');
      const user = await User.findById(decoded.id).select('-passwordHash');
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User profile not found. Authentication failed.' });
      }

      req.user = user;
      return next();
    }
  } catch (error) {
    // If accessToken is expired, catch triggers and check if we can refresh via refreshToken
    console.log('Access token expired or invalid, attempting token rotation...');
  }

  // 2. Perform token rotation if Refresh Token is valid
  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'ecotrack_jwt_refresh_secret_2026');
      const user = await User.findById(decodedRefresh.id).select('-passwordHash');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Session expired. User profile not found.' });
      }

      // Generate a new 15m Access Token
      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'ecotrack_jwt_access_secret_2026',
        { expiresIn: '15m' }
      );

      // Set cookie header for access token
      res.setHeader('Set-Cookie', [
        `access_token=${newAccessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      ]);

      req.user = user;
      return next();
    } catch (err) {
      console.error('Refresh token validation failure:', err.message);
      return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Unauthorized access. JWT cookies are missing.' });
};

module.exports = {
  protect,
  parseCookies
};
