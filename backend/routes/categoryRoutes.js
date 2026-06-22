const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { sanitizeBody, validateCategory } = require('../middleware/validateMiddleware');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', isAuthenticated, sanitizeBody, validateCategory, categoryController.create);
router.put('/:id', isAuthenticated, sanitizeBody, validateCategory, categoryController.update);
router.delete('/:id', isAuthenticated, categoryController.delete);

module.exports = router;
