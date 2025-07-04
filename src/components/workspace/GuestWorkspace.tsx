'use client';

import { useState } from 'react';
import ChatPanel from './ChatPanel';
import { guestDemoData } from '@/data/mock';
import UsersSidebar from './Sidebar';

export default function GuestWorkspace() {
  const { document, collaborators, messages: initialMessages, info } = guestDemoData;

  const [messages, setMessages] = useState(initialMessages);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);

  // Simulate realistic message status updates: sent → delivered → seen
  const onSendMessage = (content: string) => {
    if (!activeChatUser) return;

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'You',
      recipient: activeChatUser,
      content,
      status: 'sent', // just sent, not yet delivered
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate message delivered (2 gray checks) after 0.5s
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg)));
    }, 500);

    // Simulate recipient reply and mark message as seen (2 blue checks) after 1.5s more
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: 'seen' } : msg)));

      const replyMessage = {
        id: crypto.randomUUID(),
        sender: activeChatUser,
        recipient: 'You',
        content: `Got your message: "${content}"`,
        status: 'seen',
      };

      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden font-sans text-gray-100 shadow-xl rounded-2xl bg-zinc-900">
      {/* Banner */}
      <div className="px-6 py-3 text-sm font-semibold text-center text-indigo-200 bg-indigo-800">{info.banner}</div>

      <div className="flex flex-1 overflow-hidden">
        <UsersSidebar collaborators={collaborators} activeChatUser={activeChatUser} onSelectUser={setActiveChatUser} />
        <ChatPanel
          messages={messages}
          activeChatUser={activeChatUser}
          onSendMessage={onSendMessage}
          collaborators={collaborators}
          documentContent={document.content}
        />
      </div>
    </div>
  );
}
