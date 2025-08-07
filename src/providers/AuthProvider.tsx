'use client';
import { useRef, ReactNode } from 'react';
import { AuthContext, createAuthStore, AuthStore } from '@/store/useAuth';
import { User } from '@/types';

type AuthProviderProps = {
  user: User | null;
  children: React.ReactNode;
};

export function AuthProvider({ user, children }: AuthProviderProps) {
  const storeRef = useRef<AuthStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAuthStore({ user });
  }

  return <AuthContext.Provider value={storeRef.current}>{children}</AuthContext.Provider>;
}
