import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, User } from '../db/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const user = await db.users.where('email').equals(email).first();
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (name: string, email: string, password: string) => {
    if (!email.endsWith('.edu')) {
      throw new Error('Only college email addresses (.edu) are allowed');
    }

    const existingUser = await db.users.where('email').equals(email).first();
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const id = await db.users.add({
      name,
      email,
      password,
      points: 0
    });

    const newUser = await db.users.get(id);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}