'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { CheckDoubleBlue, CheckDoubleGray, CheckSingleGray } from '@/data/icons';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  status?: 'sent' | 'delivered' | 'seen';
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface ChatPanelProps {
  messages: Message[];
  activeChatUser: string | null;
  onSendMessage: (content: string) => void;
  collaborators: User[];
  documentContent: string;
}

export default function ChatPanel({ messages, activeChatUser, onSendMessage, collaborators, documentContent }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, activeChatUser]);

  if (!activeChatUser) {
    return (
      <section className="flex flex-1 flex-col overflow-auto border-l border-zinc-700 bg-zinc-800 p-8 text-gray-300">
        <h2 className="mb-4 text-2xl font-bold text-lime-400">Welcome to the guest demo</h2>
        <p className="mb-2">This document is a shared space where everyone can contribute live.</p>
        <ul className="mb-4 list-inside list-disc space-y-1">
          <li>Add your ideas freely</li>
          <li>Comment inline</li>
          <li>Chat with collaborators</li>
        </ul>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">{documentContent}</pre>
      </section>
    );
  }

  const activeUser = collaborators.find((c) => c.id === activeChatUser);
  const filteredMessages = messages.filter(
    (m) => (m.sender === 'You' && m.recipient === activeChatUser) || (m.sender === activeChatUser && m.recipient === 'You'),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const renderStatusIcon = (status?: Message['status']) => {
    if (!status) return null;
    if (status === 'sent') return <CheckSingleGray />;
    if (status === 'delivered') return <CheckDoubleGray />;
    if (status === 'seen') return <CheckDoubleBlue />;
    return null;
  };

  return (
    <section className="flex flex-1 flex-col overflow-hidden border-l border-zinc-700 bg-zinc-800">
      <header className="flex items-center gap-4 border-b border-zinc-700 px-6 py-4">
        {activeUser?.avatar ? (
          <img src={activeUser.avatar} alt={activeUser.name} className="h-10 w-10 rounded-full ring-2 ring-lime-400" loading="lazy" />
        ) : (
          <div className="grid h-10 w-10 place-content-center rounded-full bg-zinc-700 text-xs font-semibold text-gray-400 select-none">
            ?
          </div>
        )}
        <h2 className="text-xl font-semibold text-lime-400">{activeUser?.name}</h2>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {filteredMessages.map(({ id, sender, content, status }) => {
          const isUser = sender === 'You';
          return (
            <div key={id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} title={`${sender} says`}>
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 break-words ${
                  isUser ? 'rounded-br-none bg-lime-600 text-white' : 'rounded-bl-none bg-zinc-700 text-gray-300'
                }`}>
                <p className="text-md mb-1 text-left font-semibold text-gray-100">{!isUser && sender}</p>
                <p className="text-sm leading-snug">{content}</p>
                {isUser && (
                  <div className="mt-1 flex items-center justify-end space-x-1 text-xs">
                    <span className="text-gray-300">You</span>
                    {renderStatusIcon(status)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center border-t border-zinc-700 bg-zinc-900 px-6 py-4">
        <input
          type="text"
          placeholder={`Message ${activeUser?.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mr-3 flex-grow rounded-md border border-zinc-600 bg-zinc-700 px-4 py-3 text-sm text-gray-200 focus:ring-2 focus:ring-lime-400 focus:outline-none"
          aria-label="Chat message input"
          // autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
          className="cursor-pointer rounded-md bg-lime-200 p-4 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="h-5 w-5 text-black" />
        </button>
      </form>
    </section>
  );
}
