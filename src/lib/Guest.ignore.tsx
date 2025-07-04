'use client';
import { guestDemoData } from '@/data/mock';
import { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';

export default function GuestWorkspace() {
  const { document, collaborators, info } = guestDemoData;
  const [messages, setMessages] = useState(guestDemoData.messages);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState('');

  // סימולציה של תגובת משתמש אחר
  const simulateReply = () => {
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: String(Date.now()),
          sender: 'Alice',
          content: 'Thanks for your message! 😊',
        },
      ]);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: String(Date.now()), sender: 'You', content: input.trim() };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput('');
    simulateReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden font-sans text-gray-100 shadow-xl rounded-2xl bg-zinc-900">
      {/* Banner */}
      <div className="px-6 py-3 font-semibold text-center text-indigo-300 bg-indigo-900 select-none">{info.banner}</div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-700 bg-zinc-800">
        <h1 className="max-w-[60%] truncate text-3xl font-extrabold text-teal-400">{document.title}</h1>
        <div className="no-scrollbar flex max-w-[35%] items-center gap-3 overflow-x-auto">
          {collaborators.map(({ id, avatar, name }) => (
            <div
              key={id}
              title={name}
              className="flex items-center gap-2 px-3 py-1 border border-teal-600 rounded-full shadow-inner bg-zinc-700">
              {avatar ? (
                <img src={avatar} alt={name} loading="lazy" className="w-8 h-8 rounded-full ring-2 ring-teal-400" />
              ) : (
                <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-600 text-zinc-400">
                  ?
                </div>
              )}
              <span className="max-w-[100px] truncate text-sm font-semibold text-gray-200">{name}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        {/* CHAT SLIDER FOR MOBILE */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-sm transform flex-col border-r border-teal-600 bg-zinc-900 shadow-lg transition-transform duration-300 ease-in-out ${chatOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:max-w-md md:translate-x-0 md:border-none`}
          aria-label="Chat panel">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 md:hidden">
            <h2 className="text-xl font-bold text-teal-400">💬 Live Chat</h2>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
              className="p-2 text-teal-300 transition rounded hover:bg-teal-700 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-zinc-800">
            {messages.map(({ id, sender, content }) => (
              <div key={id} className="flex gap-3" title={`${sender} says`}>
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-semibold text-white bg-teal-600 rounded-full select-none">
                  {sender.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-teal-400">{sender}</p>
                  <p className="text-sm leading-snug text-gray-300">{content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input at bottom */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 px-6 py-4 border-t border-zinc-700 bg-zinc-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Chat input"
              className="flex-grow px-4 py-3 text-sm text-gray-200 placeholder-gray-500 border rounded-md border-zinc-700 bg-zinc-900 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex items-center justify-center p-2 text-white transition bg-teal-600 rounded hover:bg-teal-700">
              <Send size={20} />
            </button>
          </form>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-6 overflow-auto border-t border-zinc-700 bg-zinc-800 md:border-t-0 md:border-l md:p-8">
          <pre className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{document.content}</pre>
        </section>

        {/* CHAT TOGGLE BUTTON FOR MOBILE */}
        <button
          onClick={() => setChatOpen((v) => !v)}
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
          className="fixed z-50 flex items-center justify-center text-white transition bg-teal-600 rounded-full shadow-lg right-6 bottom-6 h-14 w-14 hover:bg-teal-700 md:hidden">
          {chatOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </button>
      </main>
    </div>
  );
}
