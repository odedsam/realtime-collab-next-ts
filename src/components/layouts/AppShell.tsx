'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { Toaster } from 'sonner';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import TanstackProvider from '@/providers/Tanstack';

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    const getUser = () => fetchUser();
    getUser();
  }, [fetchUser]);

  return (
    <body className="flex h-screen flex-col antialiased">
      <AppHeader />
      <main className="flex-grow">
        <TanstackProvider>{children}</TanstackProvider>
      </main>
      <AppFooter />
      <Toaster />
    </body>
  );
}
