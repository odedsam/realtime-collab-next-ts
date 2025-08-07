import React from 'react';
import { ChatRoom } from '@/types/db';

interface RoomViewProps {
  room: ChatRoom;
  onJoinRoom?: (roomId: string) => void;
}

const RoomView: React.FC<RoomViewProps> = ({ room, onJoinRoom }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4 text-cyan-300 sm:p-6 lg:p-8">
      <div className="animate-fade-in w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/80 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 p-6 text-zinc-900 shadow-md shadow-cyan-500/30 sm:p-8">
          <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">{room.name ?? 'Unnamed Chat Room'}</h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <p className="mb-4 text-center text-xl font-semibold sm:text-2xl">Welcome to the Room!</p>

          <div className="rounded-lg border border-zinc-700 bg-zinc-900/70 p-4 text-lg leading-relaxed text-cyan-100 shadow-inner shadow-cyan-500/5 sm:p-6">
            <p>This is the place to chat, share ideas, and meet new people. Join the conversation and start interacting!</p>
            <p className="mt-4 text-right text-sm text-cyan-500">
              Room ID: <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-cyan-400">{room.id}</span>
            </p>
          </div>

          {onJoinRoom && (
            <div className="mt-8 text-center">
              <button
                onClick={() => onJoinRoom(room.id)}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 px-8 py-3 font-medium text-zinc-900 shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105 hover:from-cyan-300 hover:via-emerald-300 hover:to-lime-200">
                Join Room
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomView;
