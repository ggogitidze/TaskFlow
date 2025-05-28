import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import Column from '../components/Column';
import { useBoardData } from '../hooks/useBoardData';
import { boardApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import TaskDetailModal from '../components/TaskDetailModal';
import BoardMembers from '../components/BoardMembers';
import InviteMembersModal from '../components/InviteMembersModal';

const BoardPage = () => {
  const { boardId } = useParams();
  const { board, loading, error, socket } = useBoardData();
  const [boards, setBoards] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile/tablet

  const openTaskDetailModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskDetailModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const fetchBoards = async () => {
    try {
      const res = await boardApi.getAll();
      setBoards(res.data);
      if ((!boardId || boardId === 'undefined') && res.data.length > 0) {
        navigate(`/board/${res.data[0]._id}`);
      }
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    }
  };

  useEffect(() => {
    fetchBoards();
    // eslint-disable-next-line
  }, [user, navigate, boardId]);

  useEffect(() => {
    console.log("Board state updated:", board);
  }, [board]);

  useEffect(() => {
    // Any BoardPage specific socket listeners can go here
  }, [socket]);

  const handleBoardCreated = (newBoard) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  // Responsive helpers
  const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Pass toggle state and handlers to TopNav for mobile/tablet
  const topNavProps = isMobileOrTablet ? {
    sidebarOpen,
    setSidebarOpen
  } : {};

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark flex items-center justify-center">
        <div className="text-primary-text-light dark:text-primary-text-dark">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-primary-bg-light dark:bg-primary-bg-dark relative overflow-hidden">
        {/* Sidebar: always visible on desktop, drawer on mobile/tablet */}
        <div className="hidden lg:block h-full">
          <Sidebar
            boards={boards}
            onBoardCreated={handleBoardCreated}
            currentBoardId={boardId}
            onBoardListUpdate={fetchBoards}
          />
        </div>
        {/* Sidebar Drawer for mobile/tablet */}
        {sidebarOpen && (
          <div className="fixed left-0 top-16 z-40 flex lg:hidden" style={{height: 'calc(100vh - 4rem)'}}>
            <div className="w-64 bg-white dark:bg-primary-bg-dark h-full shadow-xl relative">
              <Sidebar
                boards={boards}
                onBoardCreated={handleBoardCreated}
                currentBoardId={boardId}
                onBoardListUpdate={fetchBoards}
              />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Pass toggle props to TopNav for mobile/tablet */}
          <TopNav boardName={board?.title} {...topNavProps} />
          <main className="flex-1 overflow-x-auto overflow-y-hidden p-2 sm:p-4 flex space-x-2 sm:space-x-4 bg-secondary-bg-light dark:bg-secondary-bg-dark lg:pr-80">
            {loading && <p className="text-primary-text-light dark:text-primary-text-dark">Loading board...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {board?.columns.map((column) => (
              <Column key={column._id} column={column} openTaskDetailModal={openTaskDetailModal} />
            ))}
          </main>
        </div>

        {/* Right Panel: always visible on desktop, drawer on mobile/tablet */}
        <div className="hidden lg:flex fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] flex-col" style={{ pointerEvents: 'auto' }}>
          <div className="flex-1 flex flex-col justify-between p-4 pb-2" style={{ height: '100%' }}>
            <div style={{ height: '50%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <BoardMembers
                board={board}
                currentUser={user}
                onMemberKicked={fetchBoards}
              />
            </div>
            <div style={{ height: '50%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Chat socket={socket} boardId={board._id} user={user} />
            </div>
          </div>
        </div>
        {/* Right Panel Drawer for mobile/tablet */}
        {sidebarOpen && (
          <div className="fixed right-0 top-16 z-40 flex lg:hidden justify-end" style={{height: 'calc(100vh - 4rem)'}}>
            <div className="w-80 bg-white dark:bg-secondary-bg-dark h-full shadow-xl flex flex-col relative">
              <div className="flex-1 flex flex-col justify-between p-4 pb-2" style={{ height: '100%' }}>
                <div style={{ height: '50%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <BoardMembers
                    board={board}
                    currentUser={user}
                    onMemberKicked={fetchBoards}
                  />
                </div>
                <div style={{ height: '50%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <Chat socket={socket} boardId={board._id} user={user} />
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {isModalOpen && (
          <TaskDetailModal task={selectedTask} onClose={closeTaskDetailModal} boardId={boardId} />
        )}
      </div>
    </DndProvider>
  );
};

export default BoardPage; 