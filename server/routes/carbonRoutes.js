const express = require('express');
const router = express.Router();
const {
  calculateFootprint,
  saveEntry,
  getHistory,
  getEntryById,
  deleteEntry
} = require('../controllers/carbonController');
const { protect } = require('../middleware/authMiddleware');
const { validateCarbonInput } = require('../middleware/validateRequest');

router.post('/calculate', protect, validateCarbonInput, calculateFootprint);
router.post('/save', protect, validateCarbonInput, saveEntry);
router.get('/history', protect, getHistory);
router.get('/history/:id', protect, getEntryById);
router.delete('/:id', protect, deleteEntry);

module.exports = router;
