const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { isAuthenticated, requireAdminUtama } = require('../middleware/authMiddleware');

// Viewing activity logs is strictly reserved for 'admin_utama'
router.use(isAuthenticated, requireAdminUtama);

router.get('/', activityLogController.getAll);

module.exports = router;
