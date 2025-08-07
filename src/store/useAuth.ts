'use client';

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: (redirectTo?: string) => Promise<void>;
  setUser: (user: User | null) => void;
};
import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { logout as apiLogout } from '@/services/user';
import { redirect } from 'next/navigation';
import { User } from '@/types';

export type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = (initialState: Partial<AuthState>) => {
  return createStore<AuthState>((set) => ({
    user: initialState.user ?? null,
    login: (user) => set({ user }),
    logout: async (redirectTo?: string) => {
      try {
        await apiLogout();
      } catch (err) {
        console.error('Logout failed:', err);
      } finally {
        set({ user: null });
        if (redirectTo) redirect(redirectTo);
      }
    },
    setUser: (user) => set({ user }),
  }));
};

export const AuthContext = createContext<AuthStore | null>(null);

export const useAppAuth = () => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error('useAppAuth must be used within AuthProvider');
  }
  return useStore(store);
};
