'use client';

import { create } from 'zustand';
import { User } from '@/types';
import { API } from '@/services';

type AuthState = {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: (redirectTo?: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Not authenticated');
      const user = await res.json();

      return  set({user,loading:false})
    } catch(err) {
      if(err){
      set({ user: null, loading: false });}
        console.log(err);
    }

  },
  logout: async (redirectTo) => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      set({ user: null });
      if (redirectTo) window.location.href = redirectTo;
    }
  },
}));
