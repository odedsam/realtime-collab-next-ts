'use client';

import { useAuth } from '@/store/useAuth';
import Link from 'next/link';
import HamburgerButton from '@/components/layouts/HamburgerButton';
import MobileMenu from '@/components/layouts/MobileMenu';
import UserAvatar from '../ui/UserAvatar';

export default function AppHeader() {
  const { user, setUser,isAuthenticated, logout } = useAuth();
  // setUser({ id: '2', name: 'Sahar',email:"oded960@gmail.com"});


  return (
    <header className="sticky top-0 z-50 border-b border-zinc-700 bg-zinc-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white transition-colors hover:text-teal-400"
          aria-label="Go to homepage">
          RealTimeCollab
        </Link>

        {/* Navigator for desktop */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
          <Link href="#features" className="transition-colors hover:text-teal-400">
            Features
          </Link>
          <Link href="#demo" className="transition-colors hover:text-teal-400">
            Live Demo
          </Link>
          <Link href="#usecases" className="transition-colors hover:text-teal-400">
            Use Cases
          </Link>
        </nav>

        {/* Auth Buttons or User Avatar for desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated && user ? (
            <>
              <UserAvatar name={user.name} avatar={user.avatar} />
              <button onClick={logout} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700">
                Logout
              </button>
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
                className="rounded-md bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button  */}
        <div className="md:hidden">
          <HamburgerButton />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu />
    </header>
  );
}
