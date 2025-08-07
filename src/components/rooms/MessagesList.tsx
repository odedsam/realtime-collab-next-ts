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
    <div className="space-y-4 p-4 sm:p-8">
      {messages.map((msg) => {
        const isMine = msg.user?.id === 'me';
        return (
          <div key={msg.id} className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
            {!isMine && (
              <div className="mt-auto">
                <Image
                  src={msg.user?.avatar || msg.user?.image || '/next.svg'}
                  alt="avatar-profile"
                  className="rounded-full object-cover ring-2 ring-emerald-600"
                  width={40}
                  height={40}
                  quality={80}
                />
              </div>
            )}

            <div
              className={`max-w-[75%] rounded-2xl border p-4 shadow-lg ${
                isMine
                  ? 'rounded-br-none border-emerald-600 bg-gradient-to-br from-emerald-700 to-teal-700 text-emerald-50'
                  : 'rounded-bl-none border-emerald-700 bg-gradient-to-br from-zinc-800 to-teal-900 text-emerald-100'
              }`}>
              <div className="mb-1 flex items-center gap-2">
                <p className="font-semibold text-emerald-200">{msg.user?.name}</p>
                {msg.user?.isOnline && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
              </div>
              <p className="mb-2 text-xs text-emerald-400/70">{new Date(msg.timestamp).toLocaleString()}</p>
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
