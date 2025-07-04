'use client';

import { useState } from 'react';
import { guestDemoData } from '@/data/mock';
import ChatPanel from './ChatPanel';
import SettingsPanel from './SettingsPanel';
import UsersSidebar from './Sidebar';

export default function GuestWorkspace() {
  const { document, collaborators, messages: initialMessages, info } = guestDemoData;
  const [messages, setMessages] = useState(initialMessages);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const onSendMessage = (content: string) => {
    if (!activeChatUser) return;

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'You',
      recipient: activeChatUser,
      content,
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg)),
      );
    }, 500);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: 'seen' } : msg)),
      );

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

  const clearChatHistory = () => {
    setMessages([]);
  };

  return (
    <div
      className={`flex h-full min-h-screen flex-col overflow-hidden rounded-2xl bg-zinc-900 font-sans text-gray-100 shadow-xl ${darkMode ? 'dark' : ''}`}>
      <div className="px-6 py-3 text-sm font-semibold text-center text-indigo-200 bg-indigo-800">
        {info.banner}
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <UsersSidebar
          collaborators={collaborators}
          activeChatUser={activeChatUser}
          onSelectUser={setActiveChatUser}
          onArchive={(userId) => {
            const idx = collaborators.findIndex((u) => u.id === userId);
            if (idx >= 0) collaborators[idx].isArchived = true;
          }}
          onUnarchive={(userId) => {
            const idx = collaborators.findIndex((u) => u.id === userId);
            if (idx >= 0) collaborators[idx].isArchived = false;
          }}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <ChatPanel
          messages={messages}
          activeChatUser={activeChatUser}
          onSendMessage={onSendMessage}
          collaborators={collaborators}
          documentContent={document.content}
        />

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((v) => !v)}
          notificationsEnabled={notificationsEnabled}
          toggleNotifications={() => setNotificationsEnabled((v) => !v)}
          clearChatHistory={clearChatHistory}
        />
      </div>
    </div>
  );
}
