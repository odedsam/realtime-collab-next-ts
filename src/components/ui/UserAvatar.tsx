'use client';

import Image from 'next/image';
import { useAppAuth } from '@/store/useAuth';

export default function UserAvatar() {
  const user = useAppAuth((state) => state.user);

  if (!user?.id) return null;

  const userImage = user?.avatar ?? '/avatar.svg';

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border">
        <Image src={userImage} alt="User" width={40} height={40} className="object-cover" />
      </div>
      <p className="text-teal-400">Hello {user?.name}</p>
    </div>
  );
}
