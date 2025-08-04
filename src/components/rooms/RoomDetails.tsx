'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getChatRoomById, updateChatRoom, deleteChatRoom } from '@/services/chatroom';
import { ChatRoom } from '@/types/db';
import RoomView from './RoomView';

export default function ChatRoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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
    alert(`You would join room: ${roomId}`);
    // router.push(`/chat/${roomId}`);
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="p-6 text-lg text-gray-600">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 bg-gradient-to-br from-red-50 to-red-100 p-4">
        <div className="rounded-lg bg-white p-6 text-center text-red-700 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/chatrooms')}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="p-6 text-lg text-red-500">Room not found.</p>
        <button
          onClick={() => router.push('/chatrooms')}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-bottom from-indigo-600 via-cyan-600 to-pink-400 p-4 sm:p-6 lg:p-8">
      <RoomView room={room} onJoinRoom={handleJoinRoom} />

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleRename}
          className="inline-flex transform items-center justify-center rounded-full border border-transparent bg-yellow-500 px-6 py-2 text-base font-medium text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 focus:outline-none">
          Rename Room
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex transform items-center justify-center rounded-full border border-transparent bg-red-600 px-6 py-2 text-base font-medium text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none">
          Delete Room
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
