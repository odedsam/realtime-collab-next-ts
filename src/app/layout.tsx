import type { Viewport } from 'next';
import { appMetaData, geistSans, geistMono } from '@/config/appConfig';
import { Toaster } from 'sonner';
import './globals.css';
import AppHeader from '../components/layouts/AppHeader';
import AppFooter from '@/components/layouts/AppFooter';
import TanstackProvider from '@/providers/Tanstack';

export const metadata = appMetaData;
export const viewport: Viewport = { themeColor: '#27272A' };

export type LayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}>
        <AppHeader />
        <main className="flex-grow">
          <TanstackProvider>{children}</TanstackProvider>
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
