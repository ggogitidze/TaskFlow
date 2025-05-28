import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardApi } from '../utils/api';
import InviteMembersModal from './InviteMembersModal';
import InvitationsModal from './InvitationsModal';
import { useAuth } from '../context/AuthContext';
import PermissionModal from './PermissionModal';

const TrashIcon = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

const Sidebar = ({ boards, onBoardCreated, currentBoardId, onBoardListUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [permissionModal, setPermissionModal] = useState({ open: false, message: '' });

  useEffect(() => {
    // Fetch pending invites count
    const fetchInvites = async () => {
      try {
        const res = await inviteApi.getInvites();
        setPendingInvites(res.data.length);
      } catch {
        setPendingInvites(0);
      }
    };
    fetchInvites();
  }, [showInvitationsModal]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const response = await boardApi.create({ title: newBoardTitle });
      onBoardCreated(response.data);
      setNewBoardTitle('');
      setIsCreatingBoard(false);
      navigate(`/board/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) return;
    try {
      await boardApi.delete(boardId);
      await onBoardListUpdate();
      // After updating, check if there are boards left
      setTimeout(() => {
        const remainingBoards = boards.filter(b => b._id !== boardId);
        if (remainingBoards.length > 0) {
          navigate(`/board/${remainingBoards[0]._id}`);
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setPermissionModal({ open: true, message: err.response.data.message });
      } else {
        alert('Failed to delete board.');
      }
    }
  };

  return (
    <div className="w-56 bg-zoom-gray-light dark:bg-zoom-gray-darker p-4 shadow-md h-screen overflow-y-auto flex flex-col justify-between">
      <div>
      <h2 className="text-lg font-semibold text-zoom-text dark:text-zoom-text-dark mb-6">My Boards</h2>
      {isCreatingBoard ? (
        <form onSubmit={handleCreateBoard} className="mb-4 space-y-2">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="w-full p-2 border rounded bg-white text-zoom-text border-gray-300 placeholder-gray-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Board title"
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setIsCreatingBoard(false)}
              className="px-3 py-1 text-sm text-zoom-gray-dark hover:text-zoom-text dark:text-zoom-gray dark:hover:text-zoom-text-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-zoom-blue text-white rounded hover:bg-zoom-blue-dark"
            >
              Create
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingBoard(true)}
          className="w-full p-2 text-sm text-zoom-gray-dark hover:text-zoom-text hover:bg-zoom-gray rounded mb-4 dark:text-zoom-gray dark:hover:text-zoom-text-dark dark:hover:bg-zoom-gray-dark"
        >
          + Create New Board
        </button>
      )}
      <div className="space-y-1">
        {boards.map((board) => (
            <div key={board._id} className={`flex items-center group rounded ${currentBoardId === board._id ? 'bg-blue-200 dark:bg-blue-900' : ''}`}>
          <button
            onClick={() => navigate(`/board/${board._id}`)}
                className={`flex-1 text-left p-2 text-sm rounded transition-colors duration-200 bg-transparent focus:bg-gray-200 dark:focus:bg-gray-700 ${currentBoardId === board._id
                  ? 'text-blue-900 dark:text-blue-100 font-semibold bg-transparent hover:opacity-80 active:opacity-80'
                  : 'text-zoom-text dark:text-zoom-gray hover:bg-gray-100 dark:hover:bg-gray-700 hover:opacity-80 active:opacity-80'}
                `}
          >
            {board.title}
          </button>
              <div className="flex items-center">
                {user && board.user === user._id && (
                  <button
                    onClick={() => handleDeleteBoard(board._id)}
                    className="ml-2 p-1 rounded text-secondary-text-light hover:text-red-500 focus:text-red-600 dark:text-secondary-text-dark dark:hover:text-red-500 dark:focus:text-red-600 transition-colors"
                    title="Delete Board"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 mt-8">
        <button
          onClick={() => setShowInvitationsModal(true)}
          className="w-full p-2 text-sm bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-200 dark:focus:bg-gray-600 flex items-center justify-between transition-colors border border-gray-200 dark:border-gray-700"
        >
          Invitations
          {pendingInvites > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">{pendingInvites}</span>
          )}
        </button>
      </div>
      <InviteMembersModal open={showInviteModal} onClose={() => setShowInviteModal(false)} boardId={currentBoardId} />
      <InvitationsModal open={showInvitationsModal} onClose={() => setShowInvitationsModal(false)} onInviteHandled={onBoardListUpdate} />
      <PermissionModal open={permissionModal.open} onClose={() => setPermissionModal({ open: false, message: '' })} message={permissionModal.message} />
    </div>
  );
};

export default Sidebar; 