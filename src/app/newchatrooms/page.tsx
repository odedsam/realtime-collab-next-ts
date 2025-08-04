'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getChatRooms, createChatRoom } from '@/services/chatroom';
import { ChatRoom } from '@/types/db';

export default function ChatRoomsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    const { rooms: fetchedRooms, error: fetchError } = await getChatRooms();
    if (fetchError) {
      setError(fetchError);
    } else {
      setRooms(fetchedRooms);
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {

    const name = prompt('Enter room name:');
    if (!name) return;

    const { success, error: createError, room: newRoom } = await createChatRoom(name);
    if (createError) {
      setError(createError);
    } else if (success && newRoom) {

      fetchRooms();
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading rooms...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat Rooms</h1>
        <button
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Create Room
        </button>
      </div>

      <ul className="space-y-4">
        {rooms.map((room) => (
          <li key={room.id} className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
            <span className="font-medium text-black">{room.name ?? 'Unnamed room'}</span>
            <Link
               href={`http://localhost:3000/newchatrooms/${room.id}`}
              className="text-blue-600 hover:underline"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
