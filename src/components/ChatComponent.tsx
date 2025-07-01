'use client';

import { useState, useEffect, useRef } from 'react';
import type { Message, TypingIndicator } from '@/lib/types';
import { useSocket } from '@/hooks/useSocket';

interface ChatComponentProps {
  roomId: string;
  userId: string;
  username: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ roomId, userId, username }) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleJoinedRoom = (joinedRoomId: string) => {
      if (joinedRoomId === roomId) {
        setHasJoinedRoom(true);
      }
    };

    const handleUserTyping = (data: TypingIndicator) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((user) => user.userId !== data.userId);
        return data.isTyping ? [...filtered, data] : filtered;
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('joined_room', handleJoinedRoom);
    socket.on('user_typing', handleUserTyping);

    // Join room when component mounts
    socket.emit('join_room', roomId);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('joined_room', handleJoinedRoom);
      socket.off('user_typing', handleUserTyping);
      socket.emit('leave_room', roomId);
    };
  }, [socket, isConnected, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim() || !hasJoinedRoom) return;

    socket.emit('send_message', {
      message: newMessage.trim(),
      userId,
      username,
      roomId,
    });

    setNewMessage('');
    handleStopTyping();
  };

  const handleTyping = () => {
    if (!socket || !hasJoinedRoom) return;

    socket.emit('typing_start', { userId, username, roomId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (!socket || !hasJoinedRoom) return;

    socket.emit('typing_stop', { userId, username, roomId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  if (!isConnected) {
    return <div className="p-4 text-center">Connecting to chat...</div>;
  }

  return (
    <div className="flex h-96 flex-col rounded-lg border border-gray-300">
      <div className="border-b bg-gray-100 p-4">
        <h3 className="font-semibold">Room: {roomId}</h3>
        <p className="text-sm text-gray-600">User: {username}</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-xs rounded-lg p-2 ${
              message.userId === userId ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
            <p className="mb-1 text-xs opacity-70">
              {message.username} • {new Date(message.timestamp).toLocaleTimeString()}
            </p>
            <p>{message.message}</p>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.map((user) => user.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!hasJoinedRoom}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !hasJoinedRoom}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
