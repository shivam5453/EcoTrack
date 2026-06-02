/**
 * EcoTrack API Payload Validator Middleware
 */

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

const validateCarbonInput = (req, res, next) => {
  const { scope1, scope2, scope3 } = req.body;

  if (!scope1 || !scope2 || !scope3) {
    return res.status(400).json({
      success: false,
      message: 'Carbon inputs must include scope1, scope2, and scope3 sections.'
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCarbonInput
};
