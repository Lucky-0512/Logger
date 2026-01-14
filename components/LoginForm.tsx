
import React, { useState } from 'react';
import { User } from '../types';
import { apiService } from '../services/apiService';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await apiService.login(empId, password, isAdmin);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => { setIsAdmin(false); setError(''); }}
          disabled={isLoading}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Employee
        </button>
        <button
          onClick={() => { setIsAdmin(true); setError(''); }}
          disabled={isLoading}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {isAdmin ? 'Admin Username' : 'Employee ID'}
          </label>
          <input
            type="text"
            required
            disabled={isLoading}
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50"
            placeholder={isAdmin ? "heygen123" : "e.g. EMP123"}
          />
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>}
          <span>{isLoading ? 'Verifying...' : 'Login'}</span>
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button 
            disabled={isLoading} 
            onClick={onSwitchToRegister} 
            className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
          >
            Register here
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
