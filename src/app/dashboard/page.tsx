'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { socket } from '@/lib/socket-client';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
}) as React.ComponentType<{ docId: string }>;

export default function Dashboard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const search = useSearchParams();
  const docId = search.get('doc') ?? 'demo-doc-id-1';

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message'); //cleaning events to prevent memory leaks
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    socket.emit('message', trimmed);
    setMessages((prev) => [...prev, `Me: ${trimmed}`]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-black">Real-time Dashboard</h1>

      {/* Real-Time Chat Section */}
      <div className="h-64 w-full max-w-md space-y-2 overflow-y-auto rounded border bg-white p-4 shadow">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm break-words text-black">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          className="flex-1 rounded border p-2 text-black placeholder:text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
          spellCheck={false}
        />
        <button onClick={sendMessage} className="rounded bg-black px-4 text-white" disabled={!input.trim()}>
          Send
        </button>
      </div>

      {/* Live Collaborative Editor Section */}
      <Editor docId={docId} />
    </div>
  );
}
