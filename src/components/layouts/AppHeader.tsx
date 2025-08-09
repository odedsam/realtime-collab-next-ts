'use client';

import { useAuthStore } from '@/store/useAuth';
import Link from 'next/link';
import HamburgerButton from '@/components/layouts/HamburgerButton';
import MobileMenu from '@/components/layouts/MobileMenu';
import UserAvatar from '../ui/UserAvatar';

export default function AppHeader() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-700 bg-zinc-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white transition-colors hover:text-yellow-200"
          aria-label="Go to homepage">
          RealTimeCollab
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
          <Link href="/#features" className="transition-colors hover:text-yellow-200">
            Features
          </Link>
          <Link href="/#demo" className="transition-colors hover:text-yellow-200">
            Live Demo
          </Link>
          <Link href="/#usecases" className="transition-colors hover:text-yellow-200">
            Use Cases
          </Link>
           <Link href="/chatroom" className="transition-colors hover:text-yellow-200">
           Chat Rooms
          </Link>
          <Link href="/ask-ai" className="transition-colors hover:text-yellow-200">
            Ask AI
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user?.id ? (
            <>
              <UserAvatar />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-md border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-yellow-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <HamburgerButton />
        </div>
      </div>

      <MobileMenu />
    </header>
  );
}
