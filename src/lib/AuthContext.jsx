import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const token = localStorage.getItem('femcare_token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      const currentUser = await authService.me();
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('femcare_token');
      }
    } catch (err) {
      console.warn('[AuthContext] Auth verification failed:', err.message);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('femcare_token');
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const register = async (email, password, name) => {
    const data = await authService.register(email, password, name);
    if (data && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authChecked,
      login,
      register,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
