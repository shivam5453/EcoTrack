const express = require('express');
const router = express.Router();
const { register, login, logout, refresh } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validateRequest');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
