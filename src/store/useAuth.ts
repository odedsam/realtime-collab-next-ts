import { User } from '@/types';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionToken: string | null;
  deviceFingerprint: string | null;
  loading: boolean;
  error: string | null;

  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionToken: null,
  deviceFingerprint: null,
  loading: false,
  error: null,

  loginWithEmail: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionToken: data.sessionToken,
        deviceFingerprint: data.deviceFingerprint,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionToken: null,
      deviceFingerprint: null,
      loading: false,
      error: null,
    });
  },
}));
