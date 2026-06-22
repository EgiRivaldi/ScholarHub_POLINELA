const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { sanitizeBody, validateProvider } = require('../middleware/validateMiddleware');

router.get('/', providerController.getAll);
router.get('/:id', providerController.getById);
router.post('/', isAuthenticated, sanitizeBody, validateProvider, providerController.create);
router.put('/:id', isAuthenticated, sanitizeBody, validateProvider, providerController.update);
router.delete('/:id', isAuthenticated, providerController.delete);

module.exports = router;
