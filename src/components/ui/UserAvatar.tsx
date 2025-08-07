'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuth';
import { Button } from './Buttons';

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

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const avatar = user.avatar ?? '/avatar.svg';

  return (
    <div className="hidden items-center gap-4 md:flex">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
          <Image src={avatar} alt="User" width={40} height={40} className="object-cover" />
        </div>
        <p className="text-teal-400">Hello {user?.name}</p>
      </div>
      <Button onClick={() => logout('/')} className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700">
        Logout
      </Button>
    </div>
  );
}
