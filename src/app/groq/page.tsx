import GroqChatClient from '@/components/chat/GroqChat';

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1b] via-[#0d151f] to-[#0c141d] p-4 text-white sm:p-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-lime-500/5 via-transparent to-transparent" />
      <h1 className="mb-8 text-center text-3xl font-bold tracking-wide text-lime-300 drop-shadow-md">Multi Chat – AI Models</h1>
      <GroqChatClient />
    </main>
  );
}
