'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuth';
import { Button } from './Buttons';
import Link from 'next/link';
import { Loading } from '../feedback';
import { LogOut } from 'lucide-react';

export default function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((state) => state.logout);
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, loading, fetchUser]);

  if (loading) return <Loading message={'Loading...'} />;
  if (!user) return null;

  const avatar = user.avatar ?? '/avatar.svg';

  return (
    <div className="hidden items-center gap-4 md:flex">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
          <Link href="/dashboard">
            <Image src={avatar} alt="User" width={40} height={40} className="object-cover" draggable={false} />
          </Link>
        </div>
        <p className="font-sans font-semibold text-orange-200 text-shadow-2xs hover:text-amber-400">Hello {user?.name}</p>
      </div>
      <Button
        onClick={() => logout('/')}
        icon={<LogOut />}
        iconPosition='right'
        className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-400 px-3 py-2 font-medium text-zinc-900 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 hover:from-red-400 hover:via-rose-400 hover:to-orange-200">
        Logout
      </Button>
    </div>
  );
}
