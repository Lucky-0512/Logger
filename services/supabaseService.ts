
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Suggestion, User } from '../types';

/**
 * SUPABASE CONFIGURATION
 */
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://lmjakbicukonjtqqvsjk.supabase.co'; 
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtamFrYmljdWtvbmp0cXF2c2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjA5NjAsImV4cCI6MjA4NDEzNjk2MH0._h1hMf07tDPPhtxj-AA9v9Hh2TtwDsSe1AtvU7I6Pqk';

/**
 * We initialize the client conditionally to prevent the app from crashing
 * if the credentials haven't been provided.
 */
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const db = {
  // Utility to check if DB is reachable
  async testConnection(): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      return !error;
    } catch {
      return false;
    }
  },

  // Fetch all suggestions
  async getSuggestions(): Promise<Suggestion[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('date_of_suggestion', { ascending: false });
      
      if (error) {
        console.error('Supabase Error (getSuggestions):', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('Unexpected Error:', e);
      return [];
    }
  },

  // Add a new suggestion
  async addSuggestion(suggestion: Suggestion) {
    if (!supabase) throw new Error("Database not connected.");
    const { error } = await supabase.from('suggestions').insert([suggestion]);
    if (error) throw error;
  },

  // Update an existing suggestion (Admin only)
  async updateSuggestion(id: string, updates: Partial<Suggestion>) {
    if (!supabase) return;
    const { error } = await supabase.from('suggestions').update(updates).eq('id', id);
    if (error) throw error;
  },

  // Fetch all registered users
  async getUsers(): Promise<User[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  // Register a new employee user
  async registerUser(user: User) {
    if (!supabase) throw new Error("Database not connected.");
    const { error } = await supabase.from('users').insert([user]);
    if (error) throw error;
  }
};
