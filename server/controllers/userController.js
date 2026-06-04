const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CarbonEntry = require('../models/CarbonEntry');

/**
 * @desc    Get user profile details
 * @route   GET /api/user/profile
 * @access  Protected
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is already populated by authMiddleware
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        settings: req.user.settings,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name, email, password)
 * @route   PUT /api/user/profile
 * @access  Protected
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    // Handle duplicate emails if email is changing
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account.' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    // Re-hash password if updated
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        settings: updatedUser.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user preferences (theme, units, notifications)
 * @route   PUT /api/user/settings
 * @access  Protected
 */
const updateSettings = async (req, res, next) => {
  try {
    const { theme, units, notifications, goal, adoptedTips } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    if (theme) user.settings.theme = theme;
    if (units) user.settings.units = units;
    if (notifications !== undefined) user.settings.notifications = notifications;
    if (goal !== undefined) user.settings.goal = goal;
    if (adoptedTips !== undefined) user.settings.adoptedTips = adoptedTips;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully!',
      settings: updatedUser.settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account and all associated carbon records
 * @route   DELETE /api/user/account
 * @access  Protected
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Delete all carbon submissions associated with this user
    await CarbonEntry.deleteMany({ userId });

    // 2. Delete user profile itself
    await User.findByIdAndDelete(userId);

    // 3. Clear authorization cookies
    res.setHeader('Set-Cookie', [
      'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    ]);

    res.status(200).json({
      success: true,
      message: 'Your account and all recorded carbon entries have been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
  deleteAccount
};
