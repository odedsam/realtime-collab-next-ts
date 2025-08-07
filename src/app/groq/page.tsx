import GroqChatClient from '@/components/chat/GroqChat';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-700 p-6">
      <h1 className="mb-4 text-2xl font-bold leading-relaxed font-sans text-emerald-500">AI Multi Chat Model</h1>
      <GroqChatClient />
    </main>
  );
}
