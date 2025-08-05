'use client';

import { useEffect, useState } from 'react';
import { getChatRooms, createChatRoom } from '@/services/chatroom';
import { ChatRoom } from '@/types/db';
import { Button } from '@/components/ui/Buttons';

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
    <section className="h-full bg-sky-800 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chat Rooms</h1>
        <Button onClick={handleCreateRoom} className='bg-sky-300'> + Create Room</Button>
      </div>

      <ul className="space-y-4">
        {rooms.map((room) => (
          <li key={room.id} className="flex cursor-pointer items-center justify-between rounded bg-gray-100 p-4 shadow hover:bg-gray-300">
            <span className="font-medium text-black">{room.name ?? 'Unnamed room'}</span>
            <Button href={`http://localhost:3000/chatroom/${room.id}`} variant={'ghost'} className="hover:bg-sky-200 text-blue-600 hover:underline">
              View
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
