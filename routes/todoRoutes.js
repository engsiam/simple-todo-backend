
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware,todoController.create);
router.get('/', authMiddleware,todoController.findAll);
router.get('/:id', authMiddleware,todoController.findOne);
router.put('/:id', todoController.update);
router.delete('/:id', authMiddleware,todoController.delete);

module.exports = router;
