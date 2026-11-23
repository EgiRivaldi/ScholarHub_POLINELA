const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { isAuthenticated, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { sanitizeBody, validateScholarship } = require('../middleware/validateMiddleware');

// Public routes with optional auth so admins can see their drafts when logged in
router.get('/', optionalAuth, scholarshipController.getAll);
router.get('/:id', optionalAuth, scholarshipController.getById);

// Protected routes (Admin only)
router.post(
  '/',
  isAuthenticated,
  upload.single('gambar'),
  sanitizeBody,
  validateScholarship,
  scholarshipController.create
);

router.put(
  '/:id',
  isAuthenticated,
  upload.single('gambar'),
  sanitizeBody,
  validateScholarship,
  scholarshipController.update
);

router.delete('/:id', isAuthenticated, scholarshipController.delete);

module.exports = router;
