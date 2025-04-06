import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4 text-teal-300">📄 Real-time Collaboration Tool</h1>
      <p className="text-gray-600 mb-8">
        Create, edit, and share documents live with your team — fast and secure.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-black/40 text-white rounded hover:opacity-80"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 border border-black rounded hover:bg-black/60 hover:text-white text-zinc-500"
        >
          Register
        </Link>
      </div>
    </main>
  )
}
