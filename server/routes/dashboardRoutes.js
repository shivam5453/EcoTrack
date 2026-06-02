const express = require('express');
const router = express.Router();
const { getStats, getComparison } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect); // Secure all endpoints in this route file

router.get('/stats', getStats);
router.get('/comparison', getComparison);

module.exports = router;
