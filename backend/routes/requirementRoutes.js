const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { sanitizeBody, validateRequirement } = require('../middleware/validateMiddleware');

router.get('/', requirementController.getAll);
router.get('/:id', requirementController.getById);
router.get('/scholarship/:scholarshipId', requirementController.getByScholarship);
router.post('/', isAuthenticated, sanitizeBody, validateRequirement, requirementController.create);
router.put('/:id', isAuthenticated, sanitizeBody, validateRequirement, requirementController.update);
router.delete('/:id', isAuthenticated, requirementController.delete);

module.exports = router;
