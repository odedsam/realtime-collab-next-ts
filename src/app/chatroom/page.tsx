'use client';

import { useEffect, useState } from 'react';
import { getChatRooms, createChatRoom } from '@/services/chatroom';
import { ChatRoom } from '@/types/db';
import { Button } from '@/components/ui/Buttons';
import { ErrorMsg, Loading } from '@/components/feedback';
import Link from 'next/link';
import CreateRoomModal from '@/components/rooms/CreateRoomModal';
import { MessageCircle } from 'lucide-react';

export default function ChatRoomsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleCreateRoom = async (name: string) => {
    const { success, error: createError } = await createChatRoom(name);
    if (createError) {
      setError(createError);
    } else if (success) {
      setModalOpen(false);
      fetchRooms();
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <Loading message="Loading rooms..." />;
  if (error) return <ErrorMsg errMsg={error} />;

  return (
    <section className="min-h-screen bg-zinc-900 p-8 text-cyan-300">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex justify-center items-center gap-x-4">
            Chat Rooms  <MessageCircle className='size-8 text-lime-200'/>
          </h1>
          <Button
            onClick={() => setModalOpen(true)}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 px-4 py-2 font-medium text-zinc-900 shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105 hover:from-cyan-300 hover:via-emerald-300 hover:to-lime-200">
            + Create Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <p className="text-center text-lg text-zinc-500">No chat rooms yet. Create one!</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/chatroom/${room.id}`}
                  className="group block rounded-xl border border-zinc-700 bg-zinc-800/80 p-5 shadow-lg shadow-cyan-500/10 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-cyan-400 hover:shadow-cyan-400/40">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{room.name ?? 'Unnamed room'}</span>
                    <span className="rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 px-3 py-1 text-sm font-medium text-zinc-900 opacity-0 shadow-md shadow-cyan-400/30 transition-opacity group-hover:opacity-100">
                      View →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && <CreateRoomModal onClose={() => setModalOpen(false)} onCreate={handleCreateRoom} />}
    </section>
  );
}
