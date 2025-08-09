import Link from 'next/link';
import UserAvatar from './UserAvatar';

export interface NavItem {
  href: string;
  label: string;
}

export type AuthLinksProps = {
  user: {
    id: string;
  } | null;
};

const navItems: NavItem[] = [
  { href: '/#features', label: 'Features' },
  { href: '/#demo', label: 'Live Demo' },
  { href: '/#usecases', label: 'Use Cases' },
  { href: '/chatroom', label: 'Chat Rooms' },
  { href: '/ask-ai', label: 'Ask AI' },
];

export const NavLinks = () => {
  return (
    <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-300 md:flex">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="transition-colors hover:text-yellow-200">
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export const AuthLinks = ({ user }: AuthLinksProps) => {
  return (
    <div className="hidden items-center gap-4 md:flex">
      {user?.id ? (
        <UserAvatar />
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
  );
};
