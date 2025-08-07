'use client';

import type { ChatRoom } from '@/types/db';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getChatRoomById, updateChatRoom, deleteChatRoom } from '@/services/chatroom';
import { Trash, Pencil } from 'lucide-react';
import { ErrorMsg, Loading } from '@/components/feedback';
import { Button } from '@/components/ui/Buttons';
import RoomView from '@/components/rooms/RoomView';

export default function ChatRoomDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = async () => {
    setLoading(true);
    setError(null);
    if (!id) {
      setError('Room ID is missing.');
      setLoading(false);
      return;
    }

    const { room: fetchedRoom, error: fetchError } = await getChatRoomById(id);
    if (fetchError) {
      setError(fetchError);
    } else if (fetchedRoom) {
      setRoom(fetchedRoom);
    } else {
      setError('Room not found.');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!room) return;
    const isConfirmed = confirm(`Are you sure you want to delete the room "${room.name ?? 'Unnamed Room'}"?`);
    if (!isConfirmed) return;

    const { success, error: deleteError } = await deleteChatRoom(room.id);
    if (deleteError) {
      setError(deleteError);
    } else if (success) {
      alert('Room deleted successfully!');
      router.push('/chatrooms');
    }
  };

  const handleRename = async () => {
    if (!room) return;
    const newName = prompt('Enter new name for the room:', room.name ?? '');
    if (!newName || newName.trim() === '') return;

    const { success, error: updateError, room: updatedRoom } = await updateChatRoom(room.id, { name: newName.trim() });
    if (updateError) {
      setError(updateError);
    } else if (success && updatedRoom) {
      setRoom(updatedRoom);
      alert('Room renamed successfully!');
    }
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/chatroom/${roomId}/ChatInterface`);
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  if (loading) return <Loading message="Loading room details..." />;
  if (error) return <ErrorMsg errMsg={error} path="/chatrooms" />;
  if (!room) return <ErrorMsg errMsg="Room not found." path="/chatrooms" />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-6 text-cyan-300">
      <RoomView room={room} onJoinRoom={handleJoinRoom} />

      <div className="mt-8 flex gap-4">
        <Button
          onClick={handleRename}
          icon={<Pencil />}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 px-6 py-2 font-medium text-zinc-900 shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:scale-105 hover:from-cyan-300 hover:via-emerald-300 hover:to-lime-200">
          Rename Room
        </Button>
        <Button
          onClick={handleDelete}
          icon={<Trash />}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-400 px-6 py-2 font-medium text-zinc-900 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 hover:from-red-400 hover:via-rose-400 hover:to-pink-300">
          Delete Room
        </Button>
      </div>
    </div>
  );
}
