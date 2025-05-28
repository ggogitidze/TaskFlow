import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import TopNav from '../components/TopNav';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.register({ name, email, password });
      // Optionally, auto-login or redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg-light dark:bg-primary-bg-dark flex flex-col">
      <TopNav />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-4xl bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-xl shadow-xl overflow-hidden">
          {/* Left: Registration Form */}
          <div className="flex-1 flex flex-col justify-center p-10">
            <h2 className="text-2xl font-bold mb-8 text-primary-text-light dark:text-primary-text-dark text-center">Register</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-button-light dark:focus:ring-accent-button-dark mb-4"
                  placeholder="Name"
                />
              </div>
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded bg-accent-button-light dark:bg-accent-button-dark text-accent-button-text-light dark:text-accent-button-text-dark font-semibold text-lg shadow hover:opacity-90 transition"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-secondary-text-light dark:text-secondary-text-dark">
              Already have an account?{' '}
              <button type="button" className="text-accent-button-light hover:text-accent-button-dark font-medium" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
          {/* Right: Image Section styled like reference */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-accent-button-light dark:bg-accent-button-dark relative">
            <div className="flex flex-col items-center justify-center w-full h-full p-8">
              <img
                src="/images/register-image.jpg"
                alt="TaskFlow Registration"
                className="max-w-xs w-full h-auto object-contain mb-6 drop-shadow-lg"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white opacity-90 mb-1">Join and collaborate!</h3>
                <p className="text-sm text-white opacity-70">Create your account to start managing tasks with your team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 