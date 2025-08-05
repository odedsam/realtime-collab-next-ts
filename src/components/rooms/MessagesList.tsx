import React from 'react';
import Image from 'next/image';
type User = {
  id: string;
  name: string;
  avatar: string | null;
  image: string | null;
  role: string;
  lastActiveAt: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: string;
  content: string;
  timestamp: string;
  roomId: string;
  userId: string;
  user: User;
};

type Props = {
  messages: Message[];
};

const MessagesList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-3 rounded-lg p-3">
          <div className="mt-auto grid size-[40px] rounded-full bg-white">
            <Image
              src={'/next.svg'}
              alt={'avatar-profile'}
              className="h-10 w-10 rounded-full object-cover"
              width={40}
              height={40}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="flex flex-col rounded-2xl rounded-bl-none border-2 bg-white px-6">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-amber-900">{msg.user?.name}</p>
              {msg.user?.isOnline && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
            </div>
            <p className="text-xs text-black">{new Date(msg.timestamp).toLocaleString()}</p>
            <div className='p-3'>
              {' '}
              <p className="text-gray-700">{msg?.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
