
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/supabaseService';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const DEFAULT_ADMIN_ID = 'heygen123';
const DEFAULT_ADMIN_PASS = 'Lucky@0512';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isAdmin) {
      if (empId === DEFAULT_ADMIN_ID && password === DEFAULT_ADMIN_PASS) {
        onLogin({
          emp_id: DEFAULT_ADMIN_ID,
          name: 'Main Administrator',
          role: UserRole.ADMIN
        });
      } else {
        setError('Invalid Admin credentials.');
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const users = await db.getUsers();
      const foundUser = users.find(u => u.emp_id === empId && u.role === UserRole.EMPLOYEE);

      if (!foundUser) {
        setError('Employee ID not found. Please register first.');
        setIsSubmitting(false);
        return;
      }

      onLogin(foundUser);
    } catch (err) {
      setError('Could not connect to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => { setIsAdmin(false); setError(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Employee
        </button>
        <button
          onClick={() => { setIsAdmin(true); setError(''); }}
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
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={isAdmin ? "heygen123" : "e.g. EMP123"}
          />
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 font-semibold hover:underline">
            Register here
          </button>
        </div>
      )}
      
      {isAdmin && (
        <p className="mt-6 text-center text-xs text-gray-400 italic">
          Default Admin Login: <b>{DEFAULT_ADMIN_ID} / {DEFAULT_ADMIN_PASS}</b>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
