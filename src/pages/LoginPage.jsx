import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { boardApi } from '../utils/api';
import TopNav from '../components/TopNav';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Fetch boards and redirect to the first one or to /no-boards
      const boardsRes = await boardApi.getAll();
      const boards = boardsRes.data;
      if (boards && boards.length > 0) {
        navigate(`/board/${boards[0]._id}`);
      }
    } catch (err) {
      console.error('Error after login:', err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark flex flex-col">
      <TopNav />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-4xl bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-xl shadow-xl overflow-hidden">
          {/* Left: Login Form */}
          <div className="flex-1 flex flex-col justify-center p-10">
            <h2 className="text-2xl font-bold mb-8 text-primary-text-light dark:text-primary-text-dark text-center">Login</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark mb-4"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark mb-2"
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {/* Placeholder for Remember Password checkbox */}
                  <input id="remember" name="remember" type="checkbox" className="mr-2" />
                  <label htmlFor="remember" className="text-sm text-secondary-text-light dark:text-secondary-text-dark">Remember Password</label>
                </div>
                <button type="button" className="text-xs text-accent-button-light hover:text-accent-button-dark" onClick={() => {}}>
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded bg-accent-button-light dark:bg-accent-button-dark text-accent-button-text-light dark:text-accent-button-text-dark font-semibold text-lg shadow hover:opacity-90 transition"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-secondary-text-light dark:text-secondary-text-dark">
              No account yet?{' '}
              <button type="button" className="text-accent-button-light hover:text-accent-button-dark font-medium" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
          {/* Right: Image Section styled to match Register */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-accent-button-light dark:bg-accent-button-dark relative">
            <div className="flex flex-col items-center justify-center w-full h-full p-8">
              <img
                src="/images/login-image.jpg"
                alt="TaskFlow Login"
                className="max-w-xs w-full h-auto object-contain mb-6 drop-shadow-lg"
              />
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-white opacity-90 mb-1">Welcome back!</h3>
                <p className="text-sm text-white opacity-70">Log in to access your boards and manage your tasks.</p>
              </div>
              <a
                href="http://www.freepik.com"
                className="mt-2 text-xs text-white opacity-60 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Designed by vectorjuice / Freepik
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 