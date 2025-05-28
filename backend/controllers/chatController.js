const ChatMessage = require('../models/ChatMessage');
const Board = require('../models/Board');

// Get chat history for a board
exports.getBoardChat = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;

    // Check if user is a member of the board
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    const isMember =
      board.user.toString() === userId.toString() ||
      board.members.some(m => m.user.toString() === userId.toString());
    if (!isMember) return res.status(403).json({ message: 'Not authorized to view this board chat' });

    // Get chat messages for the board, sorted by timestamp
    const messages = await ChatMessage.find({ board: boardId })
      .sort({ timestamp: 1 })
      .populate('user', 'name email');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 