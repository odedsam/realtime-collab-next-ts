import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const appMetaData: Metadata = {
  title: 'WEB RTC Oded.dev',
  description: 'Real Time Communication App',
};
