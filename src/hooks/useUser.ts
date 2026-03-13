import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const { user, loading, login, logout } = useAuth();
  
  return {
    user,
    loading,
    role: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
    signIn: login,
    signOut: logout
  };
};
