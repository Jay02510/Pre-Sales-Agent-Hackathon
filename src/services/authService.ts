import { supabase } from '../lib/supabase';

export class AuthService {
  static async signUp(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async signOut() {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } finally {
      // Always clear local session data to ensure stale tokens are removed
      this.clearLocalSessionData();
    }
  }

  static clearLocalSessionData() {
    // Clear all Supabase-related session data from local storage
    const keysToRemove = [];
    
    // Iterate through localStorage to find Supabase keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found Supabase keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('sb-')) {
        sessionStorage.removeItem(key);
      }
    }
  }

  static async getCurrentUser() {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // Check for session-related errors that are expected for unauthenticated users
        if (error.message?.includes('Auth session missing!') ||
            error.message?.includes('session_not_found') || 
            error.message?.includes('Invalid JWT') ||
            error.message?.includes('Session from session_id claim in JWT does not exist')) {
          // Clear the invalid session data
          this.clearLocalSessionData();
          return null;
        }
        throw error;
      }
      
      return user;
    } catch (error: any) {
      // Handle any other session-related errors
      if (error.message?.includes('Auth session missing!') ||
          error.message?.includes('session_not_found') || 
          error.message?.includes('Invalid JWT') ||
          error.message?.includes('Session from session_id claim in JWT does not exist')) {
        // Clear the invalid session data
        this.clearLocalSessionData();
        return null;
      }
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}