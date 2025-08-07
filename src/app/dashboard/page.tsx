'use client';

import { useAppAuth } from '@/store/useAuth';

type User = {
  id: string;
  email: string;
  name?: string;
};

export default function Dashboard() {
  const { user } = useAppAuth();

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-gray-900 p-8 font-sans text-gray-100">
      <header className="mb-8">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Welcome back, {user?.name ?? user?.email}!</h1>
        <p className="text-gray-400">Your personalized dashboard awaits.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="mb-3 text-xl font-semibold">Profile Info</h2>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Name:</strong> {user?.name ?? 'N/A'}
          </p>
        </div>

        <div className="rounded-lg bg-gray-800 p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="mb-3 text-xl font-semibold">Actions</h2>
          <button
            onClick={() => alert('Logout functionality to be implemented')}
            className="mt-2 w-full rounded-md bg-red-600 py-2 font-semibold text-white transition-colors hover:bg-red-700">
            Logout
          </button>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </main>
  );
}
