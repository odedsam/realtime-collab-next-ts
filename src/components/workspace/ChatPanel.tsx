'use client';

import type { User as UserT } from '@/types';
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

export default function ChatPanel({
  messages,
  activeChatUser,
  onSendMessage,
  collaborators,
  documentContent,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatUser]);

  if (!activeChatUser) {
    return (
      <section className="flex flex-col flex-1 p-8 overflow-auto text-gray-300 border-l border-zinc-700 bg-zinc-800">
        <h2 className="mb-4 text-2xl font-bold text-teal-400">Welcome to the guest demo</h2>
        <p className="mb-2">This document is a shared space where everyone can contribute live.</p>
        <ul className="mb-4 space-y-1 list-disc list-inside">
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
    (m) =>
      (m.sender === 'You' && m.recipient === activeChatUser) ||
      (m.sender === activeChatUser && m.recipient === 'You'),
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
    <section className="flex flex-col flex-1 overflow-hidden border-l border-zinc-700 bg-zinc-800">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-700">
        {activeUser?.avatar ? (
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="w-10 h-10 rounded-full ring-2 ring-teal-400"
            loading="lazy"
          />
        ) : (
          <div className="grid w-10 h-10 text-xs font-semibold text-gray-400 rounded-full select-none place-content-center bg-zinc-700">
            ?
          </div>
        )}
        <h2 className="text-xl font-semibold text-teal-400">{activeUser?.name}</h2>
      </header>

      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {filteredMessages.map(({ id, sender, content, status }) => {
          const isUser = sender === 'You';
          return (
            <div
              key={id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              title={`${sender} says`}>
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 break-words ${
                  isUser
                    ? 'rounded-br-none bg-teal-600 text-white'
                    : 'rounded-bl-none bg-zinc-700 text-gray-300'
                }`}>
                <p className="mb-1 font-semibold text-left text-gray-100 text-md">
                  {!isUser && sender}
                </p>
                <p className="text-sm leading-snug">{content}</p>
                {isUser && (
                  <div className="flex items-center justify-end mt-1 space-x-1 text-xs">
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

      <form
        onSubmit={handleSubmit}
        className="flex items-center px-6 py-4 border-t border-zinc-700 bg-zinc-900">
        <input
          type="text"
          placeholder={`Message ${activeUser?.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-4 py-3 mr-3 text-sm text-gray-200 border rounded-md border-zinc-600 bg-zinc-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          aria-label="Chat message input"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
          className="p-2 transition bg-teal-600 rounded-md hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50">
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>
    </section>
  );
}
