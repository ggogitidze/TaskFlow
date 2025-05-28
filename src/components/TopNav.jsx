import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const TopNav = ({ sidebarOpen, setSidebarOpen, rightPanelOpen, setRightPanelOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-nav-bg-light shadow-sm dark:bg-nav-bg-dark h-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Sidebar toggle (mobile/tablet only) and logo */}
        <div className="flex items-center">
          <button
            className="lg:hidden mr-2 p-2 rounded bg-blue-500 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center group"
            aria-label="Go to landing page"
          >
            <span className="font-bold text-lg sm:text-xl flex items-center">
              <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-1 mr-2 tracking-widest" style={{letterSpacing: '0.2em'}}>TASK</span>
              <span className="font-extrabold tracking-widest text-black dark:text-white">FLOW</span>
            </span>
          </button>
        </div>

        {/* Right: User info, theme toggle, logout, right panel toggle (mobile/tablet only) */}
        <div className="flex items-center space-x-4 ml-auto">
          {user && (
            <>
              <span className="text-sm text-secondary-text-light dark:text-secondary-text-dark">
                Welcome, {user.name}
              </span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-secondary-text-light hover:text-primary-text-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark"
              >
                Logout
              </button>
            </>
          )}
          {/* Right panel toggle (mobile/tablet only) */}
          <button
            className="lg:hidden ml-2 p-2 rounded bg-blue-500 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setRightPanelOpen && setRightPanelOpen(!rightPanelOpen)}
            aria-label={rightPanelOpen ? 'Close members and chat panel' : 'Open members and chat panel'}
          >
            {rightPanelOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav; 