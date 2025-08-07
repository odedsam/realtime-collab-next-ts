'use client';

import type { ModalState } from '@/types/components';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getChatRoomById } from '@/services/chatroom';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Modal, Loading, ErrorMsg } from '@/components/feedback';
import MessagesList from '@/components/rooms/MessagesList';
import { Button } from '@/components/ui/Buttons';

export default function ChatRoomPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getChatRoomById(roomId),
    enabled: !!roomId,
  });

  const room = data?.room ?? null;
  const { messages, sendMessage } = useChatSocket(roomId);

  const showCustomModal = (state: ModalState) => setModalState(state);
  const closeCustomModal = () => setModalState(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return showCustomModal({ message: 'Cannot send empty message', type: 'alert' });
    }
    sendMessage({ message: newMessage, roomId });
    setNewMessage('');
  };

  if (isLoading) return <Loading message="Loading Room Details" />;
  if (error) return <ErrorMsg errMsg={error instanceof Error ? error.message : 'Unknown error'} path="/chatroom" />;
  if (!room) return <ErrorMsg errMsg="Room Not Found" path="/chatroom" />;

  return (
    <div className="grad-lime flex h-screen flex-col text-orange-200">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-950 p-4 shadow-md">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{room.name ?? 'Chat Room'}</h2>
        <span className="font-sans text-xs font-bold text-yellow-100 opacity-70 sm:text-sm">Room ID: {room.id}</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <MessagesList messages={messages.length > 0 ? messages : (room.messages as any) || []} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-zinc-850 flex items-center border-t border-zinc-700 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-zinc-600 bg-zinc-800 p-3 text-sm text-teal-200 placeholder-teal-500/50 focus:ring-2 focus:ring-teal-400 focus:outline-none sm:text-base"
        />
        <Button
          type="submit"
          className="ml-3 rounded-full bg-teal-500 px-6 py-2 font-semibold text-white shadow-lg transition duration-200 ease-in-out hover:scale-105 hover:bg-teal-400 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none sm:py-3">
          Send
        </Button>
      </form>

      {modalState && (
        <Modal
          message={modalState.message}
          type={modalState.type}
          onConfirm={modalState.onConfirm}
          onCancel={modalState.onCancel}
          onClose={closeCustomModal}
          defaultValue={modalState.defaultValue}
          onPromptSubmit={modalState.onPromptSubmit}
        />
      )}
    </div>
  );
}
