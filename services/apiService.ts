
import { User, Suggestion, UserRole } from '../types';

/**
 * PRODUCTION API SERVICE with Local Fallback
 */
// IMPORTANT: Replace this with your actual Render/Railway URL once you deploy the backend
const PRODUCTION_URL = 'https://suggestion-logs-api.onrender.com'; 
const LOCAL_URL = 'http://localhost:5000';

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? LOCAL_URL 
  : PRODUCTION_URL;

const LOCAL_STORAGE_KEY = 'logger_fallback_db';
const USER_STORAGE_KEY = 'logger_fallback_users';

// Helper to check if server is reachable
const isServerOnline = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    // Increased timeout for serverless cold-starts
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${BASE_URL}/api/suggestions`, { 
      method: 'GET', 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (e) {
    return false;
  }
};

const getLocalSuggestions = (): Suggestion[] => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
const saveLocalSuggestions = (s: Suggestion[]) => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(s));
const getLocalUsers = (): User[] => JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
const saveLocalUsers = (u: User[]) => localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));

export const apiService = {
  async login(empId: string, password?: string, isAdmin: boolean = false): Promise<User> {
    const online = await isServerOnline();
    
    if (online) {
      try {
        const response = await fetch(`${BASE_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emp_id: empId, password, is_admin: isAdmin }),
        });
        if (response.ok) return await response.json();
      } catch (e) { console.warn("Switching to local login fallback"); }
    }

    if (isAdmin) {
      if (empId === 'heygen123' && password === 'Lucky@0512') {
        return { emp_id: 'heygen123', name: 'Admin (Offline Mode)', role: UserRole.ADMIN };
      }
      throw new Error('Invalid Admin credentials');
    }

    const users = getLocalUsers();
    const user = users.find(u => u.emp_id === empId);
    if (!user) throw new Error('Employee ID not found locally');
    return user;
  },

  async register(name: string, empId: string): Promise<User> {
    const online = await isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${BASE_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, emp_id: empId }),
        });
        if (response.ok) return await response.json();
      } catch (e) { console.warn("Switching to local register fallback"); }
    }

    const users = getLocalUsers();
    if (users.find(u => u.emp_id === empId)) throw new Error('Already registered');
    const newUser = { name, emp_id: empId, role: UserRole.EMPLOYEE };
    saveLocalUsers([...users, newUser]);
    return newUser;
  },

  async fetchAllSuggestions(): Promise<Suggestion[]> {
    const online = await isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${BASE_URL}/api/suggestions`);
        if (response.ok) return await response.json();
      } catch (e) { console.warn("Switching to local fetch fallback"); }
    }
    return getLocalSuggestions();
  },

  async addSuggestion(suggestion: Suggestion): Promise<Suggestion> {
    const online = await isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${BASE_URL}/api/suggestions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(suggestion),
        });
        if (response.ok) return await response.json();
      } catch (e) { console.warn("Switching to local save fallback"); }
    }

    const local = getLocalSuggestions();
    saveLocalSuggestions([suggestion, ...local]);
    return suggestion;
  },

  async updateSuggestion(id: string, updates: Partial<Suggestion>): Promise<Suggestion> {
    const online = await isServerOnline();
    if (online) {
      try {
        const response = await fetch(`${BASE_URL}/api/suggestions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (response.ok) {
           const data = await response.json();
           return data as Suggestion;
        }
      } catch (e) { console.warn("Switching to local update fallback"); }
    }

    const local = getLocalSuggestions();
    const updated = local.map(s => s.id === id ? { ...s, ...updates } : s);
    saveLocalSuggestions(updated);
    return updated.find(s => s.id === id) as Suggestion;
  }
};
