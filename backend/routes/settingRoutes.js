const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { isAuthenticated, requireAdminUtama } = require('../middleware/authMiddleware');

// Public route: get only tampil_publik=1 key-values
router.get('/public', settingController.getPublic);

// Admin-protected routes (restricted strictly to 'admin_utama')
router.get('/', isAuthenticated, requireAdminUtama, settingController.getAll);
router.put('/bulk', isAuthenticated, requireAdminUtama, settingController.updateBulk);
router.put('/:key', isAuthenticated, requireAdminUtama, settingController.updateByKey);

module.exports = router;
