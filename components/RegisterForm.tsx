
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsers = localStorage.getItem('users_data_v1');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some(u => u.emp_id === empId)) {
      setError('This Employee ID is already registered.');
      return;
    }

    const newUser: User = {
      emp_id: empId,
      name,
      role: UserRole.EMPLOYEE
    };

    users.push(newUser);
    localStorage.setItem('users_data_v1', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
    onRegisterSuccess();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Employee Registration</h2>
      <p className="text-center text-gray-500 text-sm mb-6">Join the Suggestion Logs Pro portal</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
          <input
            type="text"
            required
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. EMP123"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
        >
          Create Employee Account
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already registered?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
