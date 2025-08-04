import React from 'react';
import { ChatRoom } from '@/types/db';
interface RoomViewProps {
  room: ChatRoom;
  onJoinRoom?: (roomId: string) => void;
}

const RoomView: React.FC<RoomViewProps> = ({ room, onJoinRoom }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-blue-600 text-white p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight">
            {room.name ?? 'Unnamed Chat Room'}
          </h1>

        </div>

        <div className="p-6 sm:p-8 text-gray-800">
          <p className="text-xl sm:text-2xl font-semibold mb-4 text-center">
            Welcome to the Room!
          </p>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 text-lg leading-relaxed text-gray-700">
            <p>
              This is the place to chat, share ideas, and meet new people.
              Join the conversation and start interacting!
            </p>
            <p className="mt-4 text-sm text-gray-500 text-right">
              Room ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded text-gray-700">{room.id}</span>
            </p>
          </div>

          {onJoinRoom && (
            <div className="mt-8 text-center">
              <button
                onClick={() => onJoinRoom(room.id = 'cmdwarrhn00003tdzpayzfg1e')}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transform transition duration-300 ease-in-out hover:scale-105"
              >
                Join Room
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
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
