import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

const STORAGE_KEY = 'app_auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { name: 'Demo User', role: 'user' };
    } catch {
      return { name: 'Demo User', role: 'user' };
    }
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [currentUser]);

  const setUser = useCallback((user) => setCurrentUser(user), []);

  const loginAsAdmin = useCallback(() => {
    setCurrentUser({ name: 'Demo Admin', role: 'admin' });
  }, []);

  const loginAsUser = useCallback(() => {
    setCurrentUser({ name: 'Demo User', role: 'user' });
  }, []);

  const loginWithToken = useCallback((token, { name = 'User', role = 'user' } = {}) => {
    setCurrentUser({ name, role, token });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const authFetch = useCallback(
    async (url, opts = {}) => {
      const headers = new Headers(opts.headers || {});
      if (currentUser?.token) {
        headers.set('Authorization', `Bearer ${currentUser.token}`);
      } else if (currentUser?.role) {
        headers.set('x-user-role', currentUser.role);
      }
      return fetch(url, { ...opts, headers });
    },
    [currentUser]
  );

  const value = {
    currentUser,
    setCurrentUser: setUser,
    loginAsAdmin,
    loginAsUser,
    loginWithToken,
    logout,
    authFetch
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
