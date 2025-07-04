import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="border-b shadow-sm border-zinc-700 bg-zinc-900 text-violet-400 ">
      <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
        <Link href="/" className="text-lg font-bold text-white hover:text-teal-400">
          RealTimeCollab
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="#features" className="hover:text-teal-400">
            Features
          </Link>
          <Link href="#demo" className="hover:text-teal-400">
            Live Demo
          </Link>
          <Link href="#usecases" className="hover:text-teal-400">
            Use Cases
          </Link>
          <Link href="/login" className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-1.5 hover:bg-zinc-700">
            Login
          </Link>
          <Link href="/register" className="rounded-md bg-teal-600 px-4 py-1.5 hover:bg-teal-700">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
