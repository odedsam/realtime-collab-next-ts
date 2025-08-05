'use client';

import type { ModalState } from '@/types/components';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getChatRoomById } from '@/services/chatroom';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Modal, Loading, Error } from '@/components/feedback';
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
    if (!newMessage.trim()) { return showCustomModal({ message: 'Cannot send empty message', type: 'alert' }); }

    sendMessage({ message: newMessage, roomId });
    setNewMessage('');
  };

  if (isLoading) return <Loading message="Loading Room Details" />;
  if (error) return <Error errorMessage={error instanceof Error ? error.message : 'Unknown error'} path="/chatroom" />;
  if (!room) return <Error errorMessage="Room Not Found" path="/chatroom" />;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-r from-blue-300 via-sky-300  to-purple-300">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-700 p-4 text-white shadow-md">
        <h2 className="text-2xl font-bold">{room.name ?? 'Chat Room'}</h2>
        <span className="text-sm opacity-80">Room ID: {room.id}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <MessagesList messages={messages.length > 0 ? messages : (room.messages as any) || []} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center border-t border-gray-200 bg-white p-4 shadow-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 p-3 text-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button
          type="submit"
          className="ml-3 transform rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
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
