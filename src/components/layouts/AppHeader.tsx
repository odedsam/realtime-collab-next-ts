'use client';
import Link from 'next/link';
import HamburgerButton from '@/components/layouts/HamburgerButton';
import MobileMenu from '@/components/layouts/MobileMenu';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b shadow-md border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white transition-colors hover:text-teal-400"
          aria-label="Go to homepage">
          RealTimeCollab
        </Link>

        {/* Navigator for desktop */}
        <nav className="items-center hidden gap-8 text-sm font-medium text-zinc-300 md:flex">
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

        {/* Auth Buttons for desktop */}
        <div className="items-center hidden gap-4 md:flex">
          <Link
            href="/auth/login"
            className="px-5 py-2 text-sm transition border rounded-md border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
            Login
          </Link>
          <Link href="/auth/register" className="px-5 py-2 text-sm font-semibold text-white transition bg-teal-600 rounded-md hover:bg-teal-700">
            Sign Up
          </Link>
        </div>

        {/* Hamburger Button מימין במובייל */}
        <div className="md:hidden">
          <HamburgerButton />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu />
    </header>
  );
}
