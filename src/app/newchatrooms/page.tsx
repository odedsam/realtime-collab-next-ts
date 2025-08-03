'use client';

import { useEffect, useState } from 'react';

interface ChatRoom {
  id: string;
  name: string | null;
}

export default function ChatRoomsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:4000/chatrooms');
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      setRooms(data.rooms);
    } catch (err) {
      setError('Could not load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    const name = prompt('Enter room name:');
    if (!name) return;
    await fetch('http://localhost:4000/chatrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    fetchRooms();
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
            <span className="font-medium">{room.name ?? 'Unnamed room'}</span>
            <a
              href={`/chatrooms/${room.id}`}
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
