'use client';

import { useState, useEffect } from 'react';
import { Loading } from '@/components/feedback';
import { useAuthStore } from '@/store/useAuth';
import { LogOut, Settings } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  updatedAt: string;
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard = ({ title, children }: DashboardCardProps) => (
  <div className="bg-opacity-60 rounded-2xl border border-orange-300/40 bg-zinc-800 p-7 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <h2 className="mb-5 text-2xl font-semibold tracking-wide text-orange-400">{title}</h2>
    <div className="leading-relaxed text-orange-300/80">{children}</div>
  </div>
);

const ChatList = ({ chats }: { chats: Chat[] }) => {
  if (chats.length === 0) return <p className="text-orange-400/60 italic">No chats available.</p>;

  return (
    <ul className="max-h-56 space-y-3 overflow-y-auto">
      {chats.map(({ id, name, lastMessage, updatedAt }) => (
        <li
          key={id}
          className="bg-opacity-40 cursor-pointer rounded-md border border-orange-300/30 bg-zinc-900 px-4 py-3 text-orange-300 transition-colors select-none hover:bg-orange-500/10"
          title={`${name}\nLast message: ${lastMessage}`}>
          <div className="flex justify-between text-sm font-medium text-orange-300/90">
            <span className="max-w-[65%] truncate">{name}</span>
            <time dateTime={updatedAt} className="text-xs opacity-70">
              {new Date(updatedAt).toLocaleDateString()}
            </time>
          </div>
          <p className="mt-1 truncate text-orange-400/80">{lastMessage}</p>
        </li>
      ))}
    </ul>
  );
};

export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'chatroom' | 'groq'>('chatroom');

  const [chatroomChats, setChatroomChats] = useState<Chat[]>([]);
  const [groqChats, setGroqChats] = useState<Chat[]>([]);

  useEffect(() => {
    setChatroomChats([
      { id: '1', name: 'General Chat', lastMessage: 'See you tomorrow!', updatedAt: '2025-08-07T15:00:00Z' },
      { id: '2', name: 'Dev Talk', lastMessage: 'Pushed new update.', updatedAt: '2025-08-06T10:30:00Z' },
    ]);
    setGroqChats([
      { id: 'a', name: 'Groq Analytics', lastMessage: 'Report ready.', updatedAt: '2025-08-05T20:45:00Z' },
      { id: 'b', name: 'Groq Bot', lastMessage: 'Reminder sent.', updatedAt: '2025-08-03T18:00:00Z' },
      { id: 'c', name: 'Groq Team', lastMessage: 'Meeting rescheduled.', updatedAt: '2025-08-02T09:00:00Z' },
    ]);
  }, []);

  if (loading) return <Loading message="Loading..." />;

  const recentActivities = [
    { id: 1, action: 'Logged in', time: '5 mins ago' },
    { id: 2, action: 'Updated profile', time: '1 hour ago' },
    { id: 3, action: 'Joined chat room', time: 'Yesterday' },
  ];

  return (
    <main
      className={`min-h-screen bg-zinc-900 p-12 font-sans antialiased ${darkMode ? 'text-orange-300' : 'text-orange-400'}`}
      style={{ fontVariantLigatures: 'common-ligatures' }}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-semibold tracking-wide md:text-5xl">
            Welcome back,{' '}
            <span className="font-semibold text-orange-400 underline decoration-orange-400 decoration-1 underline-offset-4">
              {user?.name ?? user?.email}
            </span>
            !
          </h1>
          <p className="mt-4 text-base text-orange-400/80">Your refined dashboard awaits.</p>
        </header>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Profile Information">
            <p className="mb-2">
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
            <p>
              <strong>Name:</strong> {user?.name ?? 'N/A'}
            </p>
          </DashboardCard>

          <DashboardCard title="Chats Overview">
            <div className="mb-5 flex gap-4">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'chatroom' ? 'bg-orange-400 text-zinc-900 shadow-sm' : 'bg-zinc-800 text-orange-400 hover:bg-zinc-700'
                }`}
                onClick={() => setActiveTab('chatroom')}>
                Chat Rooms
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeTab === 'groq' ? 'bg-orange-400 text-zinc-900 shadow-sm' : 'bg-zinc-800 text-orange-400 hover:bg-zinc-700'
                }`}
                onClick={() => setActiveTab('groq')}>
                Groq Chats
              </button>
            </div>
            {activeTab === 'chatroom' ? <ChatList chats={chatroomChats} /> : <ChatList chats={groqChats} />}
          </DashboardCard>
          <DashboardCard title="Settings Shortcut">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="flex items-center gap-2 rounded-md border border-transparent bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 px-5 py-2 font-medium text-zinc-900 shadow-sm transition hover:brightness-105 focus:ring-4 focus:ring-yellow-300 focus:outline-none">
              <Settings size={18} />
              Toggle Dark Mode
            </button>
          </DashboardCard>

          <DashboardCard title="Status">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400"></span>
              <span className="font-medium text-yellow-300">Currently Online</span>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Activity">
            <ul className="list-inside list-disc space-y-2 text-orange-300/80">
              {recentActivities.map(({ id, action, time }) => (
                <li key={id}>
                  <span className="font-semibold text-yellow-300">{action}</span> — <span>{time}</span>
                </li>
              ))}
            </ul>
          </DashboardCard>
          <DashboardCard title="Quick Actions">
            <button
              onClick={() => alert('Logout functionality to be implemented')}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 px-6 py-3 font-semibold text-zinc-900 shadow-sm transition hover:shadow-md focus:ring-4 focus:ring-yellow-300 focus:outline-none">
              <LogOut size={20} />
              Logout
            </button>
          </DashboardCard>
        </section>
      </div>
    </main>
  );
}
