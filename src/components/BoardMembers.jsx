import React, { useState } from 'react';
import { inviteApi, boardApi } from '../utils/api';

const getInitials = (name, email) => {
  if (typeof name === 'string' && name.trim()) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  if (typeof email === 'string' && email.trim()) {
    return email[0].toUpperCase();
  }
  return '?';
};

const BoardMembers = ({ board, currentUser, onMemberKicked, onInvite }) => {
  const [kicking, setKicking] = useState(null);

  const isAdminOrOwner =
    board.user._id === currentUser._id ||
    board.members.some(m => m.user._id === currentUser._id && m.role === 'Admin');

  const handleKick = async (memberId) => {
    setKicking(memberId);
    try {
      await boardApi.update(board._id, {
        members: board.members.filter(m => m.user._id !== memberId)
      });
      if (onMemberKicked) onMemberKicked();
    } catch (err) {
      alert('Failed to remove member');
    } finally {
      setKicking(null);
    }
  };

  const allMembers = [
    { user: board.user, role: 'Owner' },
    ...board.members.map(m => ({ ...m, isSelf: m.user._id === currentUser._id }))
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex flex-col h-full" style={{ minHeight: 0 }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Team Members ({allMembers.length})</h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl" onClick={onMemberKicked}>&times;</button>
      </div>
      <div className="space-y-3 mb-4 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {allMembers.map((m, idx) => (
          m.user && (
            <div key={m.user._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded p-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold text-lg" style={{ background: '#8884d8' }}>
                  {getInitials(m.user.name, m.user.email)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {(m.user.name ? m.user.name : m.user.email)} {m.user._id === currentUser._id && '(You)'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">{m.user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{m.role}</span>
                {isAdminOrOwner && m.user._id !== currentUser._id && m.role !== 'Owner' && (
                  <button
                    onClick={() => handleKick(m.user._id)}
                    disabled={kicking === m.user._id}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                    title="Remove member"
                  >
                    &#8942;
                  </button>
                )}
              </div>
            </div>
          )
        ))}
      </div>
      {isAdminOrOwner && (
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 mt-2"
          onClick={onInvite}
        >
          Invite Members
        </button>
      )}
    </div>
  );
};

export default BoardMembers; 