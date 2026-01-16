
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Suggestion } from './types';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { db } from './services/supabaseService';

const STORAGE_KEY_CURRENT_USER = 'current_user_v1';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Initialize data from Cloud DB
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [connected, fetchedSuggestions, fetchedUsers] = await Promise.all([
        db.testConnection(),
        db.getSuggestions(),
        db.getUsers()
      ]);
      
      setIsDbConnected(connected);
      setSuggestions(fetchedSuggestions);
      
      const storedCurrentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (storedCurrentUser) {
        const user = JSON.parse(storedCurrentUser);
        setCurrentUser(user);
        setView('dashboard');
      }
    } catch (error) {
      console.error("Failed to load data from database:", error);
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const addSuggestion = async (newSuggestion: Omit<Suggestion, 'id' | 'date_of_suggestion' | 'emp_id' | 'suggested_by'>) => {
    if (!currentUser) return;

    const suggestion: Suggestion = {
      ...newSuggestion,
      id: crypto.randomUUID(),
      date_of_suggestion: new Date().toISOString().split('T')[0],
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

    try {
      await db.addSuggestion(suggestion);
      setSuggestions(prev => [suggestion, ...prev]);
    } catch (error) {
      console.error("Failed to save suggestion:", error);
      alert("Error saving to database. Check RLS policies.");
    }
  };

  const updateSuggestion = async (id: string, updates: Partial<Suggestion>) => {
    try {
      await db.updateSuggestion(id, updates);
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (error) {
      console.error("Failed to update suggestion:", error);
      alert("Error updating database record.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Initialising Cloud Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentUser={currentUser} onLogout={handleLogout} dbStatus={isDbConnected} />
      
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

      <footer className="bg-white border-t py-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Suggestion Logs Pro • {isDbConnected ? 'Synced with Cloud' : 'Offline Mode'}
          </p>
          <div className="flex items-center space-x-2 text-[8px] text-gray-300 font-black uppercase">
            <span>Supabase PostgreSQL</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span>{isDbConnected ? 'Active' : 'Disconnected'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
