'use client';

import { API } from '@/services';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Buttons';
import { Bot, SquareTerminal, Cpu, Send } from 'lucide-react';
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
    <div className="mx-auto flex h-full max-h-screen min-h-[30rem] w-full max-w-3xl flex-col rounded-2xl bg-[#0f172a] p-4 text-white">
      <div className="mb-3 flex justify-center gap-2">
        {MODELS.map((m) => (
          <Button
            key={m}
            onClick={() => setModel(m)}
            className={`cursor-pointer px-4 py-1 text-sm font-medium transition-all duration-200 ${model === m ? 'bg-blue-600 text-white shadow-2xs hover:text-bold  hover:border-2 hover:border-yellow-300 hover:bg-transparent' : 'bg-slate-700 text-gray-300 hover:bg-cyan-200 hover:text-purple-700'}`}>
            {m}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-inner">
        <CurrentModelDisplay modelName={model} />
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap shadow-md transition-all duration-300 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200'
              }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={2}
          className="max-w-[80%] flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white shadow-inner placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
        <Button
          onClick={sendMessage}
          icon={<Send />}
          iconPosition={'right'}
          disabled={loading}
          className="min-h-[58px] min-w-[140px] cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-start text-sm text-white transition hover:bg-cyan-400 disabled:opacity-50">
          {loading ? '...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
