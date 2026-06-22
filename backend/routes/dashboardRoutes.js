const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Secure all dashboard routes
router.use(isAuthenticated);

router.get('/stats', dashboardController.getStats);
router.get('/recent', dashboardController.getRecent);

module.exports = router;
