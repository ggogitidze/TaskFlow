const Invite = require('../models/Invite');
const User = require('../models/User');
const Board = require('../models/Board');

// Send an invite
exports.sendInvite = async (req, res) => {
  try {
    const { boardId, inviteeEmail, role } = req.body;
    const inviterId = req.user._id;

    // Check if board exists
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Check if invitee is already a member
    const inviteeUser = await User.findOne({ email: inviteeEmail });
    if (inviteeUser) {
      const isMember = board.members.some(m => m.user.toString() === inviteeUser._id.toString());
      if (isMember || board.user.toString() === inviteeUser._id.toString()) {
        return res.status(400).json({ message: 'User is already a member of this board' });
      }
    }

    // Check for existing pending invite
    const existingInvite = await Invite.findOne({ board: boardId, inviteeEmail, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ message: 'Invite already sent to this email' });
    }

    // Create invite
    const invite = new Invite({
      board: boardId,
      inviter: inviterId,
      inviteeEmail,
      role: role || 'Member',
    });
    await invite.save();
    res.status(201).json(invite);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get invites for the current user
exports.getInvites = async (req, res) => {
  try {
    const email = req.user.email;
    const invites = await Invite.find({ inviteeEmail: email, status: 'pending' }).populate('board inviter');
    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Accept an invite
exports.acceptInvite = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;
    const userId = req.user._id;
    const email = req.user.email;
    const invite = await Invite.findById(inviteId);
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ message: 'Invite not found or already handled' });
    }
    if (invite.inviteeEmail !== email) {
      return res.status(403).json({ message: 'You are not authorized to accept this invite' });
    }
    // Add user to board members
    const board = await Board.findById(invite.board);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    // Prevent duplicate
    if (!board.members.some(m => m.user.toString() === userId.toString())) {
      board.members.push({ user: userId, role: invite.role });
      await board.save();
    }
    invite.status = 'accepted';
    await invite.save();
    res.json({ message: 'Invite accepted', boardId: board._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject an invite
exports.rejectInvite = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;
    const email = req.user.email;
    const invite = await Invite.findById(inviteId);
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ message: 'Invite not found or already handled' });
    }
    if (invite.inviteeEmail !== email) {
      return res.status(403).json({ message: 'You are not authorized to reject this invite' });
    }
    invite.status = 'rejected';
    await invite.save();
    res.json({ message: 'Invite rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 