import type { Viewport } from 'next';
import { appMetaData, geistSans, geistMono } from '@/config/appConfig';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata = appMetaData;
export const viewport: Viewport = { themeColor: '#27272A' };

export type LayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
