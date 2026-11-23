const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Public route: get active and scheduled announcements
router.get('/public', announcementController.getPublic);

// Admin-protected routes
router.get('/', isAuthenticated, announcementController.getAll);
router.get('/:id', isAuthenticated, announcementController.getById);
router.post('/', isAuthenticated, announcementController.create);
router.put('/:id', isAuthenticated, announcementController.update);
router.delete('/:id', isAuthenticated, announcementController.delete);

module.exports = router;
