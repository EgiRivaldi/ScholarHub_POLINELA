const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.get('/session', isAuthenticated, authController.checkSession);

module.exports = router;
