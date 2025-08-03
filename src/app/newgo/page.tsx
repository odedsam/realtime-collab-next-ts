'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: string;
  username: string;
  message: string;
  timestamp?: string;
};

let socket: Socket;

export default function Chat() {
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch rooms list from API
  useEffect(() => {
    fetch('http://localhost:4000/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []))
      .catch(() => setRooms([]));
  }, []);

  // Setup socket when room selected
  useEffect(() => {
    if (!selectedRoom) return;

    socket = io('http://localhost:4000');
    socket.emit('join_room', selectedRoom);

    socket.on('joined_room', (roomId: string) => {
      console.log('Joined room:', roomId);
    });

    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      setMessages([]);
    };
  }, [selectedRoom]);

  async function createRoom() {
    if (!newRoomName.trim()) {
      alert('Please enter a room name');
      return;
    }
    const res = await fetch('http://localhost:4000/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoomName.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setRooms((prev) => [...prev, data.room]);
      setSelectedRoom(data.room);
      setNewRoomName('');
    } else {
      const err = await res.json();
      alert(err.error || 'Error creating room');
    }
  }

  function sendMessage() {
    if (!message.trim() || !selectedRoom) return;
    socket.emit('send_message', {
      message,
      userId: null,
      roomId: selectedRoom,
    });
    setMessage('');
  }

  if (!selectedRoom) {
    return (
      <main className="max-w-xl mx-auto p-6 bg-gray-600 h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-center">Select or Create a Chat Room</h1>

        <ul className="mb-6 space-y-3">
          {rooms.map((room) => (
            <li key={room}>
              <button
                onClick={() => setSelectedRoom(room)}
                className="w-full text-left px-4 py-3 border rounded-md hover:bg-blue-600 hover:text-white transition"
              >
                {room}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-grow px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createRoom}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create Room
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 flex flex-col h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Room: {selectedRoom}</h1>
        <button
          onClick={() => setSelectedRoom(null)}
          className="text-blue-600 hover:underline"
        >
          ← Back to rooms
        </button>
      </div>

      <div className="flex-grow border rounded-md p-4 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No messages yet</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold">{msg.username ?? 'Anonymous'}:</span>{' '}
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </main>
  );
}
