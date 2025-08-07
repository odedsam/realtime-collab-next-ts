'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function GroqChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      const aiResponse = data?.choices?.[0]?.message?.content?.trim();

      if (aiResponse) {
        setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto flex h-[90vh] w-full max-w-2xl bg-blue-900 flex-col p-4">
      <div className="flex-1 overflow-y-auto rounded-xl border p-4 shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-700'}`}>
            <span className="inline-block max-w-[80%] rounded-lg bg-gray-100 px-3 py-2">{msg.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-xl border px-3 py-2 text-sm shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50">
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
