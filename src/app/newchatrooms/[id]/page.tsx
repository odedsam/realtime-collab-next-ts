'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ChatRoom {
  id: string;
  name: string | null;
}

export default function ChatRoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoom = async () => {
    const res = await fetch(`http://localhost:4000/chatrooms/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setRoom(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:4000/chatrooms/${id}`, { method: 'DELETE' });
    router.push('/chatrooms');
  };

  const handleRename = async () => {
    const name = prompt('Enter new name', room?.name ?? '');
    if (!name) return;
    await fetch(`http://localhost:4000/chatrooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    fetchRoom();
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading room...</p>;
  if (!room) return <p className="p-6 text-red-500">Room not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{room.name ?? 'Unnamed room'}</h1>
      <div className="flex gap-4">
        <button
          onClick={handleRename}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Rename
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
