const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const ChatMessage = require('./models/ChatMessage');
const Board = require('./models/Board');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000'
];

if (!MONGO_URI || !JWT_SECRET) {
  console.error('Required environment variables are missing');
  process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io/'
});

io.on('connection', async (socket) => {
  console.log('a user connected');
  console.log('Socket connection details:');
  console.log('  ID:', socket.id);
  console.log('  Handshake query:', socket.handshake.query);
  console.log('  Handshake headers:', socket.handshake.headers);
  console.log('  Handshake auth:', socket.handshake.auth);

  const token = socket.handshake.auth?.token;

  // Add event listener for socket errors
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });

  if (!token) {
    console.log('No token provided in Socket.io handshake');
    socket.disconnect(true);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionally, fetch user from DB to ensure it's a valid user
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   console.log('Invalid user for Socket.io connection');
    //   socket.disconnect(true);
    //   return;
    // }
    console.log('Socket.io token validated for user ID:', decoded.userId);
    socket.userId = decoded.userId; // Attach user ID to socket object for later use
    console.log(`Socket.io connection established for user ${socket.userId}`);

    // Add disconnect listener
    socket.on('disconnect', (reason) => {
      console.log(`Socket ${socket.id} disconnected due to: ${reason}`);
    });

  } catch (err) {
    console.error('Socket.io token validation failed:', err.message);
    socket.disconnect(true);
    return;
  }

  console.log('Setting up Socket.io event handlers...');

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`User joined board: ${boardId}`);
  });

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    const { boardId, message, user } = data;
    try {
      // Check if user is a member of the board
      const board = await Board.findById(boardId);
      if (!board) return;
      const isMember =
        board.user.toString() === socket.userId.toString() ||
        board.members.some(m => m.user.toString() === socket.userId.toString());
      if (!isMember) return;

      // Save message to DB
      const chatMsg = await ChatMessage.create({
        board: boardId,
        user: socket.userId,
        message,
        timestamp: new Date()
      });
      await chatMsg.populate('user', 'name email');

      // Broadcast to board room
      io.to(boardId).emit('chat-message', {
        user: { id: chatMsg.user._id, name: chatMsg.user.name },
        message: chatMsg.message,
        timestamp: chatMsg.timestamp
      });
    } catch (err) {
      console.error('Error handling chat-message:', err);
    }
  });

  socket.on('task-created', (data) => {
    io.to(data.boardId).emit('task-created', data.task);
  });

  socket.on('task-updated', (data) => {
    io.to(data.boardId).emit('task-updated', data.task);
  });

  socket.on('task-moved', (data) => {
    io.to(data.boardId).emit('task-moved', data);
  });

  socket.on('task-deleted', (data) => {
    io.to(data.boardId).emit('task-deleted', data.taskId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 