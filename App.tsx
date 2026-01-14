
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Suggestion, Category, AreaToWorkOn } from './types';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const STORAGE_KEY_SUGGESTIONS = 'suggestions_data_v1';
const STORAGE_KEY_USERS = 'users_data_v1';
const STORAGE_KEY_CURRENT_USER = 'current_user_v1';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const storedSuggestions = localStorage.getItem(STORAGE_KEY_SUGGESTIONS);
    const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    const storedCurrentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);

    if (storedSuggestions) setSuggestions(JSON.parse(storedSuggestions));
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
      setView('dashboard');
    }
    setIsLoading(false);
  }, []);

  // Persist suggestions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUGGESTIONS, JSON.stringify(suggestions));
  }, [suggestions]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    setView('login');
  };

  const addSuggestion = (newSuggestion: Omit<Suggestion, 'id' | 'date_of_suggestion' | 'emp_id' | 'suggested_by'>) => {
    if (!currentUser) return;

    const suggestion: Suggestion = {
      ...newSuggestion,
      id: crypto.randomUUID(),
      date_of_suggestion: new Date().toLocaleDateString(),
      emp_id: currentUser.emp_id,
      suggested_by: currentUser.name,
      evaluation: '',
      current_status: '',
      reviewed: '',
      conclusion: '',
      went_live: '',
      final_status: '',
      owner: '',
      tentative_eta: '',
      revised_date: '',
      remarks: ''
    };

    setSuggestions(prev => [suggestion, ...prev]);
  };

  const updateSuggestion = (id: string, updates: Partial<Suggestion>) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'login' && (
          <div className="max-w-md mx-auto">
            <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />
          </div>
        )}

        {view === 'register' && (
          <div className="max-w-md mx-auto">
            <RegisterForm onRegisterSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />
          </div>
        )}

        {view === 'dashboard' && currentUser && (
          <>
            {currentUser.role === UserRole.EMPLOYEE ? (
              <UserDashboard 
                currentUser={currentUser} 
                onSubmit={addSuggestion} 
                mySuggestions={suggestions.filter(s => s.emp_id === currentUser.emp_id)} 
              />
            ) : (
              <AdminDashboard 
                suggestions={suggestions} 
                onUpdate={updateSuggestion} 
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Suggestion Logs Pro. Confidential Internal Tool.
      </footer>
    </div>
  );
};

export default App;
