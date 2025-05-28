const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', taskController.createTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);
router.put('/:taskId/move', taskController.moveTask);

module.exports = router; 