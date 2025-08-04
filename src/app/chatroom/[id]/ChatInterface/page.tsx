'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/useNewSocket';
import { getChatRoomById } from '@/services/chatroom';
import { ChatRoom } from '@/types/db';




interface ReceivedMessage {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
}


interface CustomModalProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  type: 'alert' | 'confirm' | 'prompt';
  defaultValue?: string;
  onPromptSubmit?: (value: string) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  message,
  onConfirm,
  onCancel,
  onClose,
  type,
  defaultValue = '',
  onPromptSubmit,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleConfirm = () => {
    if (type === 'prompt' && onPromptSubmit) {
      onPromptSubmit(inputValue);
    } else if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="mb-4 text-lg text-gray-800">{message}</p>
        {type === 'prompt' && (
          <input
            type="text"
            className="mb-4 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <div className="flex justify-end space-x-3">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`rounded-md px-4 py-2 text-white ${
              type === 'alert' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {type === 'prompt' ? 'Submit' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ChatRoomPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('test_user_id');
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);


  interface ModalState {
    message: string;
    type: 'alert' | 'confirm' | 'prompt';
    onConfirm?: () => void;
    onCancel?: () => void;
    onPromptSubmit?: (value: string) => void;
    defaultValue?: string;
  }
  const [modalState, setModalState] = useState<ModalState | null>(null);


  const { socket, isConnected, error: socketError, joinRoom, sendMessage } = useSocket('http://localhost:4000'); // Your server URL

  // Callback to show modal
  const showCustomModal = useCallback((state: ModalState) => {
    setModalState(state);
  }, []);

  // Callback to close modal
  const closeCustomModal = useCallback(() => {
    setModalState(null);
  }, []);


  useEffect(() => {
    if (socketError) {
      setError(`Socket Error: ${socketError}`);
      showCustomModal({
        message: `Socket connection error: ${socketError}`,
        type: 'alert',
      });
    }
  }, [socketError, showCustomModal]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);
      if (!roomId) {
        setError('Room ID is missing.');
        setLoading(false);
        return;
      }

      const { room: fetchedRoom, error: fetchError } = await getChatRoomById(roomId);
      if (fetchError) {
        setError(fetchError);
      } else if (fetchedRoom) {
        setRoom(fetchedRoom);
      } else {
        setError('Room not found.');
      }
      setLoading(false);
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !isConnected || !roomId) {

      return;
    }


    joinRoom(roomId);
    console.log(`Attempting to join room ${roomId} from ChatRoomPage.`);



    const handleReceiveMessage = (data: ReceivedMessage) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('receive_message', handleReceiveMessage);


    return () => {
      if (socket) {
        socket.off('receive_message', handleReceiveMessage);

        // socket.emit('leave_room', roomId);
      }
    };
  }, [socket, isConnected, roomId, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected && roomId) {
      newMessage && console.log('newMessage :',newMessage);
      sendMessage({
        message: newMessage.trim(),
        roomId: roomId,

      });
      setNewMessage('');
    } else {
      showCustomModal({
        message: 'Cannot send message: Not connected, empty message, or no room ID.',
        type: 'alert',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="p-6 text-lg text-gray-600">Loading chat room details...</p>
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      {/* Header */}
      <div className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
        <h2 className="text-2xl font-bold">{room.name ?? 'Chat Room'}</h2>
        <span className="text-sm opacity-80">Room ID: {room.id}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 shadow-md ${
                msg.userId === currentUserId
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {msg.userId === currentUserId ? 'You' : msg.username || 'Guest'}
              </div>
              <p className="text-base break-words">{msg.message}</p>
              <div className="text-xs opacity-75 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 shadow-lg flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 text-black p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <button
          type="submit"
          className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          Send
          <svg className="ml-2 -mr-1 h-5 w-5 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.684-.275a1 1 0 00.573-.118l6.027-3.264a1 1 0 00-.026-1.61L4.324 10.39a1 1 0 111.096-1.61l4.876 2.638a1 1 0 001.096-1.61l-4.876-2.638a1 1 0 111.096-1.61l4.876 2.638a1 1 0 001.096-1.61l-4.876-2.638z" />
          </svg>
        </button>
      </form>

      {modalState && (
        <CustomModal
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
