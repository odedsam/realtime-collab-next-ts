'use client';

import { API } from '@/services';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Buttons';
import { Send } from 'lucide-react';
import { CurrentModelDisplay } from './ModelDisplay';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const MODELS = ['groq', 'together', 'openrouter'] as const;
type Model = (typeof MODELS)[number];

export default function GroqChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Model>('groq');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model }),
      });

      const data = await res.json();
      const aiResponse = data?.content?.trim();

      if (aiResponse) {
        setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
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
    <div className="mx-auto flex h-full min-h-[32rem] w-full max-w-5xl flex-col rounded-2xl bg-[#0c101b]/90 p-4 shadow-xl backdrop-blur-lg sm:p-6">
      {/* Selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
        {MODELS.map((m) => (
          <button
            key={m}
            onClick={() => setModel(m)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
              model === m
                ? 'border-lime-400 bg-lime-500 text-black shadow-md'
                : 'border-gray-600 bg-[#1a1a1a] text-gray-300 hover:border-lime-400 hover:text-lime-300'
            }`}>
            {m}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-[#202939] bg-[#101a27] p-4 shadow-inner sm:p-6">
        <CurrentModelDisplay modelName={model} />

        <div className="mt-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap shadow-md sm:max-w-[75%] ${
                  msg.role === 'user' ? 'bg-lime-500 text-black' : 'border border-gray-700 bg-[#1c2531] text-gray-200'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-700 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-lime-400 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:bg-lime-400 disabled:opacity-50 sm:w-auto">
          {loading ? (
            '...'
          ) : (
            <>
              Send <Send size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
