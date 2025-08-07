import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black px-6 py-20 text-center text-lime-200 shadow-inner">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-lime-300 drop-shadow-lg sm:text-6xl">
        RealTime Collaboration. Collaborate Live.
      </h1>
      <p className="mx-auto mb-8 max-w-xl text-lg text-lime-100/90 sm:text-xl">
        Create documents, brainstorm ideas, and chat – together, in real-time.
      </p>
      <div className="flex justify-center items-center gap-4">
        <Link href="/chatroom" className="rounded-xl bg-lime-400 px-6 py-2 text-sm font-medium text-black shadow-lg hover:bg-lime-500">
          Try as Guest
        </Link>
        <Link
          href="/auth/register"
          className="rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700">
          Sign Up
        </Link>
      </div>
    </section>
  );
}
