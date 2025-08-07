'use client';

import React from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import TanstackProvider from '@/providers/Tanstack';
import { Toaster } from 'sonner';
import { User } from '@/types';

type Props = {
  children: React.ReactNode;
  user: User | null;
};

export default function AppShell({ children, user }: Props) {
  return (
    <body className="flex h-screen flex-col antialiased">
      <AuthProvider user={user}>
        <AppHeader />
        <main className="flex-grow">
          <TanstackProvider>{children}</TanstackProvider>
        </main>
        <AppFooter />
        <Toaster />
      </AuthProvider>
    </body>
  );
}
