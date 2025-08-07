'use client';

import { useUiStore } from '@/store/useUiStore';

export default function HamburgerButton() {
  const { isMenuOpen, toggleMobileMenu } = useUiStore();

  return (
    <button
      onClick={toggleMobileMenu}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      className="relative flex flex-col items-center justify-center w-8 h-8 md:hidden">
      <span
        className={`absolute block h-0.5 w-6 rounded bg-lime-300 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`}
      />
      <span
        className={`absolute block h-0.5 w-6 rounded bg-lime-300 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
      />
      <span
        className={`absolute block h-0.5 w-6 rounded bg-lime-300 transition-transform duration-300 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`}
      />
    </button>
  );
}
