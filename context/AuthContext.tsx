"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: 'admin' | 'student') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setUser({
        id: 'a1',
        name: 'OIR Administrator',
        email: 'admin@thu.edu.tw',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      });
    } else {
      setUser({
        id: 's1',
        name: 'Alex Rivera',
        studentId: '1120001',
        email: 'alex.rivera@thu.edu.tw',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
