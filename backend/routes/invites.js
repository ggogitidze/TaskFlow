const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const inviteController = require('../controllers/inviteController');

// Send an invite
router.post('/', auth, inviteController.sendInvite);

// Get invites for current user
router.get('/', auth, inviteController.getInvites);

// Accept an invite
router.post('/:inviteId/accept', auth, inviteController.acceptInvite);

// Reject an invite
router.post('/:inviteId/reject', auth, inviteController.rejectInvite);

module.exports = router; 