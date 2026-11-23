const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, requireAdminUtama } = require('../middleware/authMiddleware');
const { sanitizeBody, validateAdmin } = require('../middleware/validateMiddleware');

// Secure all admin management routes: must be authenticated AND have role 'admin_utama'
router.use(isAuthenticated, requireAdminUtama);

router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.post('/', sanitizeBody, validateAdmin, adminController.create);
router.put('/:id', sanitizeBody, validateAdmin, adminController.update);
router.patch('/:id/status', adminController.toggleStatus);
router.delete('/:id', adminController.delete);

module.exports = router;
