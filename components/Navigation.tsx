
import React from 'react';
import { User } from '../types';

interface NavigationProps {
  currentUser: User | null;
  onLogout: () => void;
  dbStatus?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser, onLogout, dbStatus }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold tracking-tight">Logger</span>
          </div>
          
          {/* Connection Status Indicator */}
          <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${dbStatus ? 'bg-blue-500/30 border-blue-400/50 text-blue-100' : 'bg-red-500/30 border-red-400/50 text-red-100'}`}>
            <span className={`w-2 h-2 rounded-full ${dbStatus ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            <span>{dbStatus ? 'Cloud Live' : 'DB Offline'}</span>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-blue-100 opacity-80 uppercase">{currentUser.role} Portal</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-inner"
            >
              <span>Logout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
