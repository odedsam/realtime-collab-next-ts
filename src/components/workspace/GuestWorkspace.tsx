'use client';
import { guestDemoData } from '@/data/mock';

export default function GuestWorkspace() {
  const { document, collaborators, messages, info } = guestDemoData;

  return (
    <div className="flex flex-col h-full min-h-screen overflow-hidden font-sans text-gray-100 shadow-xl rounded-2xl bg-zinc-900">
      {/* Banner */}
      <div className="px-6 py-3 text-sm font-semibold text-center text-indigo-200 bg-indigo-800">{info.banner}</div>

      {/* Header with title and collaborators */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-700 bg-zinc-800">
        <h1 className="max-w-[60%] truncate text-3xl font-extrabold text-teal-400">{document.title}</h1>
        <div className="no-scrollbar flex max-w-[35%] items-center gap-3 overflow-x-auto">
          {collaborators.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 px-3 py-1 border border-teal-600 rounded-full shadow-inner bg-zinc-700"
              title={user.name}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-teal-400" loading="lazy" />
              ) : (
                <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-600 text-zinc-400">
                  ?
                </div>
              )}
              <span className="max-w-[100px] truncate text-sm font-semibold text-gray-200">{user.name}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Chat section on the LEFT */}
        <aside className="flex flex-col order-1 border-r w-96 border-zinc-700 bg-zinc-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-teal-400">💬 Live Chat</h2>
          </div>

          <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
            {messages.map(({ id, sender, content }) => (
              <div key={id} className="flex items-start gap-3" title={`${sender} says`}>
                <div className="flex items-center justify-center flex-shrink-0 font-semibold text-white bg-teal-600 rounded-full select-none h-9 w-9">
                  {sender.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-semibold text-teal-400">{sender}</p>
                  <p className="text-sm leading-snug text-gray-300">{content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-zinc-700">
            <input
              type="text"
              placeholder="Type your message..."
              disabled
              className="w-full px-4 py-2 text-sm text-gray-400 placeholder-gray-500 border rounded-md cursor-not-allowed border-zinc-700 bg-zinc-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              aria-label="Chat input (disabled demo)"
            />
          </div>
        </aside>

        {/* Document section on the RIGHT */}
        <section className="flex-1 order-2 p-8 overflow-auto border-l border-zinc-700 bg-zinc-800">
          <pre className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{document.content}</pre>
        </section>
      </main>
    </div>
  );
}
