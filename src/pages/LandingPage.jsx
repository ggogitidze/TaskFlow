import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { boardApi } from '../utils/api';

const LandingPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleYourTaskFlow = async () => {
    try {
      const boardsRes = await boardApi.getAll();
      const boards = boardsRes.data;
      if (boards && boards.length > 0) {
        navigate(`/board/${boards[0]._id}`);
      }
    } catch (err) {
      console.error('Error fetching boards:', err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark text-gray-900 dark:text-gray-100 flex flex-col scroll-smooth snap-y snap-mandatory overflow-y-auto">
      <TopNav />
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 snap-start" style={{scrollSnapAlign: 'start'}}>
        <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 h-full w-full py-8 md:py-0">
          <div className="flex flex-col justify-center h-full w-full max-w-2xl items-center md:items-start text-center md:text-left px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 text-primary-text-light dark:text-primary-text-dark leading-tight">
              Organize. Collaborate. Succeed.<br />
              <span className="text-accent-button-light dark:text-accent-button-dark">TaskFlow</span> makes teamwork effortless.
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-secondary-text-light dark:text-secondary-text-dark max-w-xl">
              The modern, real-time task board for teams who want to get things done together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {user ? (
                <button
                  onClick={handleYourTaskFlow}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-accent-button-light dark:bg-accent-button-dark text-accent-button-text-light dark:text-accent-button-text-dark text-base sm:text-lg font-semibold rounded-full shadow hover:opacity-90 transition duration-300"
                >
                  Your TaskFlow
                </button>
              ) : (
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-accent-button-light dark:bg-accent-button-dark text-accent-button-text-light dark:text-accent-button-text-dark text-base sm:text-lg font-semibold rounded-full shadow hover:opacity-90 transition duration-300">
                    Get Started Free
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center h-full w-full md:w-auto mt-8 md:mt-0">
            <div className="w-full max-w-[400px] lg:max-w-xl flex items-center justify-center">
              <img 
                src="/landingPage.jpg" 
                alt="Landing Page Illustration" 
                className="w-full h-auto object-contain"
                style={{maxHeight: '420px'}}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-xs sm:text-sm text-secondary-text-light dark:text-secondary-text-dark opacity-70 px-4">
        &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage; 