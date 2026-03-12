import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Profile } from '../lib/types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (role: UserRole) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('agrolink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (role: UserRole) => {
    const mockUser: Profile = {
      id: 'mock-id-' + role,
      full_name: `Agro ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('agrolink_user', JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('agrolink_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
