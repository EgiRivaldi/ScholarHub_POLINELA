const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { sanitizeBody, validateAdmin } = require('../middleware/validateMiddleware');

// Secure all routes in this router
router.use(isAuthenticated);

router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.post('/', sanitizeBody, validateAdmin, adminController.create);
router.put('/:id', sanitizeBody, validateAdmin, adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router;
