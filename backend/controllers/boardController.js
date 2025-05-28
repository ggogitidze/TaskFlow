const Board = require('../models/Board');

// Get all boards for the authenticated user
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { user: req.user._id },
        { 'members.user': req.user._id }
      ]
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single board by ID
exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate({
        path: 'columns.tasks',
        model: 'Task'
      })
      .populate('user', 'name email')
      .populate('members.user', 'name email');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const board = await Board.create({
      title,
      user: req.user._id,
      columns: [
        { title: 'To Do', tasks: [] },
        { title: 'In Progress', tasks: [] },
        { title: 'Done', tasks: [] }
      ]
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a board
exports.updateBoard = async (req, res) => {
  try {
    const { title, columns } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Check if user is owner or admin
    if (
      board.user.toString() !== req.user._id.toString() &&
      !board.members.some(m => m.user.toString() === req.user._id.toString() && m.role === 'Admin')
    ) {
      return res.status(403).json({ message: 'You do not have permission to update this board.' });
    }
    board.title = title || board.title;
    board.columns = columns || board.columns;
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Only owner can delete
    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the board owner can delete this board.' });
    }
    await board.deleteOne();
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 