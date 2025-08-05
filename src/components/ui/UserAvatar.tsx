'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/store/useAuth';

type UserType = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
};

export default function UserAvatar({ name }: Partial<UserType>) {
  const { user, setUser,isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // TODO: Replace this simulation with your real auth fetch
    const loggedIn = true;
    if (loggedIn) {
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: '/avatar.svg',
      });
    } else {
      setUser(null);
    }
  }, []);

  const userImage = user?.avatar || '/avatar.svg';

  return (
    <>
      <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border">
        {<Image src={userImage} alt={'User'} width={40} height={40} className="object-cover" />}
      </div>
      <>{name && <p className="text-teal-400">Hello {name}</p>}</>
    </>
  );
}
