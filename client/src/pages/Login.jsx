import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearningPath } from '../contexts/LearningPathContext';
import { BookOpen, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { fetchLearningPath, skillAssessment } = useLearningPath();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const userData = await login(email, password);
      console.log(userData);
      
      // If user is an employee, fetch their learning path
      if (userData.role === 'employee') {
        await fetchLearningPath();
        // If we got a skill assessment quiz, redirect to skill assessment page
        if (skillAssessment) {
          navigate('/skill-assessment');
        } else {
          navigate('/dashboard');
        }
      } else {
        // For admin users, go to admin dashboard
        navigate('/admin');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">LearnPro AI</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-xs text-center text-gray-500">
            Demo credentials:
          </p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">Admin:</p>
              <p>admin@learnpro.ai</p>
              <p>admin</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="font-semibold">Employee:</p>
              <p>employee@learnpro.ai</p>
              <p>emp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;