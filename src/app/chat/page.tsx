'use client';

import { useState } from 'react';
import { ChatComponent } from '@/components/workspace/ChatComponent';
import { ConnectionStatus } from '@/components/feedback/ConnectionStatus';

export default function ChatPage() {
  const [userId] = useState(() => `user_${Date.now()}`);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="h-full bg-zinc-800">
        <div className="max-w-md p-8 mx-auto mt-12 bg-indigo-400 rounded-xl">
          <h1 className="mb-6 text-2xl font-bold">Join Chat</h1>

          <ConnectionStatus />

          <form onSubmit={handleJoinChat} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium">
                Username
              </label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" required />
            </div>

            <div>
              <label htmlFor="roomId" className="block mb-2 text-sm font-medium">
                Room ID
              </label>
              <input id="roomId" type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="input" required />
            </div>

            <button type="submit" className="btn">
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-800">
      <div className="p-8 mx-auto">
        <div className="mb-6">
          <ConnectionStatus />
        </div>

        <ChatComponent roomId={roomId} userId={userId} username={username} />

        <button
          onClick={() => setIsJoined(false)}
          className="px-4 py-2 mt-4 text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600">
          Leave Chat
        </button>
      </div>
    </div>
  );
}
