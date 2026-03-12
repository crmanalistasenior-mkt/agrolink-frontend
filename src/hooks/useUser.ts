import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const { user, loading, signIn, signOut } = useAuth();
  
  return {
    user,
    loading,
    role: user?.role || null,
    isAuthenticated: !!user,
    signIn,
    signOut
  };
};
