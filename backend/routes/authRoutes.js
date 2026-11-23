const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { loginRateLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/login', loginRateLimiter, authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/session', isAuthenticated, authController.checkSession);

module.exports = router;
