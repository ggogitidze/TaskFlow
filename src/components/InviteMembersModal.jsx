import React, { useState } from 'react';
import { inviteApi } from '../utils/api';

const roles = ['Member', 'Admin'];

const InviteMembersModal = ({ open, onClose, boardId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await inviteApi.sendInvite({ boardId, inviteeEmail: email, role });
      setSuccess('Invite sent!');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2 text-xl text-gray-700 dark:text-gray-200 hover:text-red-500" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Invite Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <select
            className="w-full p-2 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors" disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </button>
          {error && <div className="text-red-500 text-sm dark:text-red-400">{error}</div>}
          {success && <div className="text-green-600 text-sm dark:text-green-400">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default InviteMembersModal; 