import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import BoardPage from './pages/BoardPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg-light dark:bg-primary-bg-dark">
        <div className="text-primary-text-light dark:text-primary-text-dark text-lg font-semibold">Loading...</div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // const socket = io("http://localhost:5000"); // Connect to your backend

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark text-gray-900 dark:text-gray-100">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/board/:boardId"
                element={
                  <ProtectedRoute>
                    <BoardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 