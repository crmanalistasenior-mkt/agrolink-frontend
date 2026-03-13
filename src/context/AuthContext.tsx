import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserRole } from '../lib/types';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (currentSession: Session | null) => {
      if (!currentSession?.user) {
        if (mounted) setUser(null);
        return;
      }

      console.log('2. Buscando profile para:', currentSession.user.id);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, full_name, avatar_url')
          .eq('id', currentSession.user.id)
          .single();

        console.log('3. Profile encontrado:', data, error);

        if (error) throw error;

        if (mounted) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email!,
            full_name: data.full_name,
            role: data.role as UserRole,
            avatar_url: data.avatar_url
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', JSON.stringify(error, null, 2));
        if (mounted) setUser(null);
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          await fetchProfile(initialSession);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        await fetchProfile(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Intentando login con:', email);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('1. signInWithPassword resultado:', data, error);
    
    if (error) {
      console.log('Error completo:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  if (loading && !session && !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
