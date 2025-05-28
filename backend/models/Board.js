const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  columns: [columnSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Owner', 'Admin', 'Member'], default: 'Member' }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema); 