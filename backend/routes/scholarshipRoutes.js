const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { sanitizeBody, validateScholarship } = require('../middleware/validateMiddleware');

router.get('/', scholarshipController.getAll);
router.get('/:id', scholarshipController.getById);

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
