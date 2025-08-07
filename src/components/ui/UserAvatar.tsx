'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useAppAuth } from '@/store/useAuth';

type UserType = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
};

export default function UserAvatar({ name }: Partial<UserType>) {
  const { user, isAuthenticated, logout } = useAppAuth();

  useEffect(() => {
    // TODO: Replace this simulation with your real auth fetch
  }, [isAuthenticated]);

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
