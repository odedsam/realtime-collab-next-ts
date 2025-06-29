//home
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-800 px-6 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-teal-300">📄 Real-time Collaboration Tool</h1>
      <p className="mb-8 text-gray-600">Create, edit, and share documents live with your team — fast and secure.</p>

      <div className="flex gap-4">
        <Link href="/auth/login" className="rounded bg-black/40 px-6 py-2 text-white hover:opacity-80">
          Login
        </Link>
        <Link href="/auth/register" className="rounded border border-black px-6 py-2 text-zinc-500 hover:bg-black/60 hover:text-white">
          Register
        </Link>
      </div>
    </main>
  );
}
