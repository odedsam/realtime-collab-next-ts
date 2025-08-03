'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
  roomId: string;
};

export default function ChatRoom({ roomId, userId }: { roomId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');

    socketRef.current.emit('join_room', roomId);

    socketRef.current.on('joined_room', (room: string) => {
      console.log(`Joined room ${room}`);
    });

    socketRef.current.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.emit('leave_room', roomId);
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current?.emit('send_message', {
      message: input,
      userId,
      roomId,
    });
    setInput('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.username}:</b> {m.message} <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
