
import React, { useState } from 'react';
import { apiService } from '../services/apiService';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiService.register(name, empId);
      alert('Registration successful! You can now log in.');
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
          <input
            type="text"
            required
            disabled={isLoading}
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50"
            placeholder="e.g. EMP123"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>}
          <span>{isLoading ? 'Creating Account...' : 'Create Employee Account'}</span>
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already registered?{' '}
        <button 
          disabled={isLoading} 
          onClick={onSwitchToLogin} 
          className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
