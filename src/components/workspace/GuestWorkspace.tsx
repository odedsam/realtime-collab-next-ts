'use client';
import { guestDemoData } from '@/data/mock';

export default function GuestWorkspace() {
  const { document, collaborators, messages, info } = guestDemoData;

  return (
    <div className="min-h-screen p-8 space-y-8 font-sans text-teal-300 bg-zinc-900">
      {/* Banner */}
      <div className="p-4 text-sm font-medium text-center border rounded-lg shadow-md border-zinc-700 bg-zinc-800">{info.banner}</div>

      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">{document.title}</h1>
        <div className="flex flex-wrap gap-3">
          {collaborators.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-1.5 shadow-inner"
              title={c.name}>
              {c.avatar ? (
                <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full ring-2 ring-teal-400" loading="lazy" />
              ) : (
                <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-700 text-zinc-400">
                  ?
                </div>
              )}
              <span className="max-w-[100px] truncate font-semibold text-white">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document Content */}
      <pre
        className="max-h-[350px] overflow-auto rounded-2xl border border-zinc-700 bg-zinc-800 p-8 text-sm leading-relaxed whitespace-pre-wrap shadow-lg"
        aria-label="Document content">
        {document.content}
      </pre>

      {/* Tips */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {info.tips.map((tip, i) => (
          <div
            key={i}
            className="p-4 font-medium text-center transition-colors border rounded-lg shadow-md cursor-default border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            title={tip}>
            {tip}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold tracking-wide text-white drop-shadow-md">💬 Live Chat</h2>
        <div className="p-6 space-y-3 overflow-y-auto border shadow-inner max-h-72 rounded-xl border-zinc-700 bg-zinc-800">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <strong className="text-purple-400">{msg.sender}:</strong> <span className="text-teal-300">{msg.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
