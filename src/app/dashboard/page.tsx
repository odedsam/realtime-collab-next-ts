'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { socket } from '@/lib/socket-client';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: true,
}) as React.ComponentType<{ docId: string }>;

export default function Dashboard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(socket.connected);
  const search = useSearchParams();
  const docId = search.get('doc') ?? 'demo-doc-id-1';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 1;

  useEffect(() => {
    const tryConnect = () => {
      if (socket.connected) return;

      socket.connect();

      socket.once('connect', () => {
        reconnectAttempts.current = 0;
        setConnected(true);
      });

      socket.once('disconnect', () => {
        setConnected(false);
      });

      socket.once('connect_error', () => {
        reconnectAttempts.current++;
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(tryConnect, 5000);
        } else {
          console.error('Max reconnect attempts reached');
          setConnected(false);
        }
      });
    };

    tryConnect();

    socket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    socket.emit('message', trimmed);
    setMessages((prev) => [...prev, `Me: ${trimmed}`]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-[#121212] px-6 py-10 text-gray-300">
      <h1 className="text-3xl font-extrabold text-teal-300">Real-time Dashboard</h1>

      {/* Collaborative Editor */}
      <div className="w-full max-w-4xl rounded-lg border border-gray-700 bg-[#1E1E1E] p-6 shadow-lg">
        <Editor docId={docId} />
      </div>

      <div className={`text-center text-sm ${connected ? 'text-green-400' : 'text-red-600'}`}>
        {connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Chat Box */}
      <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 flex h-64 w-full max-w-md flex-col space-y-2 overflow-y-auto rounded-lg border border-gray-700 bg-[#1E1E1E] p-4 shadow-lg">
        {messages.length === 0 && <p className="mt-auto mb-auto text-center text-gray-500 select-none">Waiting for messages...</p>}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded px-3 py-1 text-sm break-words ${
              msg.startsWith('Me:') ? 'max-w-[80%] self-end bg-blue-600 text-white' : 'max-w-[80%] bg-gray-700 text-gray-300'
            }`}
            style={{ wordBreak: 'break-word' }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and Send Button */}
      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          className="flex-1 rounded border border-gray-600 bg-[#1E1E1E] p-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600"
          disabled={!input.trim()}
          type="button">
          Send
        </button>
      </div>
    </div>
  );
}
