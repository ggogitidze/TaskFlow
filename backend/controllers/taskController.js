const Board = require('../models/Board');
const Task = require('../models/Task');

// Create a new task in a column
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, columnId } = req.body;
    if (!title || !columnId) return res.status(400).json({ message: 'Title and columnId are required' });
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Permission check: owner or admin
    if (
      board.user.toString() !== req.user._id.toString() &&
      !board.members.some(m => m.user.toString() === req.user._id.toString() && m.role === 'Admin')
    ) {
      return res.status(403).json({ message: 'You do not have permission to add tasks to this board.' });
    }
    const task = await Task.create({
      title,
      description,
      dueDate,
      board: board._id,
      columnId
    });
    // Add task to the column
    const column = board.columns.id(columnId);
    if (!column) return res.status(404).json({ message: 'Column not found' });
    column.tasks.push(task._id);
    await board.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, dueDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Permission check: owner or admin
    if (
      board.user.toString() !== req.user._id.toString() &&
      !board.members.some(m => m.user.toString() === req.user._id.toString() && m.role === 'Admin')
    ) {
      return res.status(403).json({ message: 'You do not have permission to delete tasks from this board.' });
    }
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Remove task from all columns
    board.columns.forEach(column => {
      column.tasks = column.tasks.filter(tid => tid.toString() !== req.params.taskId);
    });
    await board.save();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Move a task between columns
exports.moveTask = async (req, res) => {
  try {
    const { fromColumnId, toColumnId, index } = req.body;
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Permission check: owner or admin
    if (
      board.user.toString() !== req.user._id.toString() &&
      !board.members.some(m => m.user.toString() === req.user._id.toString() && m.role === 'Admin')
    ) {
      return res.status(403).json({ message: 'You do not have permission to move tasks in this board.' });
    }
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Remove from old column
    const fromColumn = board.columns.id(fromColumnId);
    if (!fromColumn) return res.status(404).json({ message: 'From column not found' });
    fromColumn.tasks = fromColumn.tasks.filter(tid => tid.toString() !== req.params.taskId);
    // Add to new column at specified index
    const toColumn = board.columns.id(toColumnId);
    if (!toColumn) return res.status(404).json({ message: 'To column not found' });
    if (typeof index === 'number') {
      toColumn.tasks.splice(index, 0, task._id);
    } else {
      toColumn.tasks.push(task._id);
    }
    // Update task's columnId
    task.columnId = toColumnId;
    await task.save();
    await board.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 