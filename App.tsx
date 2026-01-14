
import React, { useState, useEffect } from 'react';
import { User, UserRole, Suggestion } from './types';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { apiService } from './services/apiService';

const STORAGE_KEY_SESSION = 'current_user_session_v1';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize: Check for existing session and load data
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_SESSION);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          const data = await apiService.fetchAllSuggestions();
          setSuggestions(data);
          setView('dashboard');
        }
      } catch (err) {
        console.error("Failed to restore session", err);
        localStorage.removeItem(STORAGE_KEY_SESSION);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    setIsSyncing(true);
    try {
      const data = await apiService.fetchAllSuggestions();
      setSuggestions(data);
      setView('dashboard');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setView('login');
    setSuggestions([]);
  };

  const addSuggestion = async (newSuggestion: Omit<Suggestion, 'id' | 'date_of_suggestion' | 'emp_id' | 'suggested_by'>) => {
    if (!currentUser) return;

    const suggestion: Suggestion = {
      ...newSuggestion,
      id: crypto.randomUUID(),
      date_of_suggestion: new Date().toLocaleDateString(),
      emp_id: currentUser.emp_id,
      suggested_by: currentUser.name,
    } as Suggestion;

    setIsSyncing(true);
    try {
      await apiService.addSuggestion(suggestion);
      // Refresh local state from "server"
      const data = await apiService.fetchAllSuggestions();
      setSuggestions(data);
    } catch (err) {
      alert("Error saving suggestion to database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const updateSuggestion = async (id: string, updates: Partial<Suggestion>) => {
    setIsSyncing(true);
    try {
      await apiService.updateSuggestion(id, updates);
      const data = await apiService.fetchAllSuggestions();
      setSuggestions(data);
    } catch (err) {
      alert("Failed to update database record.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Connecting to secure server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {isSyncing && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-[9999] overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_infinite_linear]"></div>
        </div>
      )}
      
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

      <footer className="bg-white border-t py-4 px-4 flex justify-between items-center text-gray-400 text-xs">
        <div>&copy; {new Date().getFullYear()} Suggestion Logs Pro. Confidential.</div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isSyncing ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
          {isSyncing ? 'Database Syncing...' : 'Database Connected'}
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
