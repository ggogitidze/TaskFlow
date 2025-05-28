const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  columnId: { type: String, required: true }, // reference to column _id in Board
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema); 