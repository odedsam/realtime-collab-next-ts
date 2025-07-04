'use client';
import Link from 'next/link';
import { X } from 'lucide-react'; // אם משתמש ב־lucide
import { useCloseMobileMenu, useIsMenuOpen } from '@/store/useUiStore';

const menuItems = [
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Live Demo' },
  { href: '#usecases', label: 'Use Cases' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Sign Up' },
];

export default function MobileMenu() {
  const isMenuOpen = useIsMenuOpen();
  const closeMobileMenu = useCloseMobileMenu();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeMobileMenu}
        className={`bg-opacity-60 fixed inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 transform border-r border-teal-600 bg-zinc-900 shadow-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="p-2 text-teal-300 transition rounded-md hover:bg-teal-700 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Menu items */}
        <ul className="flex flex-col gap-6 p-4 text-lg font-semibold text-teal-300">
          {menuItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={closeMobileMenu}
                className="block px-4 py-2 transition-colors rounded-md hover:bg-teal-700 hover:text-white">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
