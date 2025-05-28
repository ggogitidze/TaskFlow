const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.use(auth);

router.get('/', boardController.getBoards);
router.get('/:id', boardController.getBoard);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);
router.use('/:boardId/tasks', require('./tasks'));

// Get chat history for a board
router.get('/:boardId/chat', chatController.getBoardChat);

module.exports = router; 