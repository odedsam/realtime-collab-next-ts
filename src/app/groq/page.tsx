import GroqChatClient from '@/components/chat/GroqChat';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-700 p-6">
      <h1 className="mb-4 text-xl font-bold">🤖 Chat with AI (Groq)</h1>
      <GroqChatClient />
    </main>
  );
}
