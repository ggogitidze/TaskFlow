import React, { useEffect, useState } from 'react';
import { inviteApi } from '../utils/api';

const InvitationsModal = ({ open, onClose, onInviteHandled }) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setLoading(true);
      inviteApi.getInvites()
        .then(res => setInvites(res.data))
        .catch(() => setError('Failed to load invites'))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleAction = async (inviteId, action) => {
    try {
      if (action === 'accept') {
        await inviteApi.acceptInvite(inviteId);
      } else {
        await inviteApi.rejectInvite(inviteId);
      }
      setInvites(invites.filter(inv => inv._id !== inviteId));
      if (onInviteHandled) onInviteHandled();
    } catch {
      setError('Failed to update invite');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Pending Invitations</h2>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-4">
            {invites.length === 0 ? <div className="text-gray-500 dark:text-gray-300">No pending invites.</div> : invites.map(invite => (
              <div key={invite._id} className="border rounded shadow bg-white dark:bg-gray-700 p-3 flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">Board: {invite.board?.title || 'N/A'}</span>
                <span className="text-gray-700 dark:text-gray-200">Invited by: {invite.inviter?.name || invite.inviter?.email}</span>
                <span className="text-gray-700 dark:text-gray-200">Role: {invite.role}</span>
                <div className="flex space-x-2 mt-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors" onClick={() => handleAction(invite._id, 'accept')}>Accept</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors" onClick={() => handleAction(invite._id, 'reject')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default InvitationsModal; 