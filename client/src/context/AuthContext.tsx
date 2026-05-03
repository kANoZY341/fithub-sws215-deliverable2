import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { AuthUser } from '../types';
import { mergeUserWithProfile, readAccountProfile, saveAccountProfile } from '../lib/accountProfile';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('fithub_token'));
  const [loading, setLoading] = useState(true);

  const persistSession = (nextToken: string, nextUser: AuthUser) => {
    const mergedUser = mergeUserWithProfile(nextUser, readAccountProfile());
    localStorage.setItem('fithub_token', nextToken);
    localStorage.setItem('fithub_user', JSON.stringify(mergedUser));
    setToken(nextToken);
    setUser(mergedUser);
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('fithub_token');
    localStorage.removeItem('fithub_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem('fithub_token')) return;
    try {
      const { data } = await api.get('/users/me');
      const nextUser: AuthUser = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone || '',
        preferredBranch: data.preferredBranch || ''
      };
      const mergedUser = mergeUserWithProfile(nextUser, readAccountProfile());
      localStorage.setItem('fithub_user', JSON.stringify(mergedUser));
      setUser(mergedUser);
    } catch {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const savedUser = localStorage.getItem('fithub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    refreshMe().finally(() => setLoading(false));
  }, [refreshMe]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
  };

  const register = async ({
    firstName,
    lastName,
    email,
    phone,
    password
  }: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { data } = await api.post('/auth/register', { name: fullName, email, phone, password });
    saveAccountProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      email: email.trim(),
      phone: phone.trim(),
      role: data?.user?.role || 'user'
    });
    persistSession(data.token, data.user);
  };

  const logout = () => clearSession();

  const value = { user, token, loading, login, register, logout, refreshMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
