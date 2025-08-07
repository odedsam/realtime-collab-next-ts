import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { geistSans, geistMono, appMetaData } from '@/config/appConfig';
import { getUser } from '@/lib/auth.server';
import AppShell from '@/components/layouts/AppShell';
import './globals.css';

export const metadata = appMetaData;
export const viewport: Viewport = { themeColor: '#27272A' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = getUser();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <AppShell user={user}>{children}</AppShell>
    </html>
  );
}
