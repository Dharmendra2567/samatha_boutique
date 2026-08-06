'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  checkSession: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.user) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return data.user;
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed';
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const signup = async (name, email, password, phone, address) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { name, email, password, phone, address });
      if (data.user) {
        setUser(data.user);
        toast.success(`Account created successfully! Welcome, ${data.user.name}.`);
        return data.user;
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Sign up failed';
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
