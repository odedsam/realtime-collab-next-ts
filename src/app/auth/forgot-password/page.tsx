'use client';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || 'Something went wrong');
    } catch {
      setMessage('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-black px-4">
      <div className="animate-fade-in w-full max-w-md space-y-6 rounded-2xl bg-zinc-800 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-white">Forgot Your Password?</h1>
        <p className="text-center text-sm text-zinc-400">Enter your email address and we’ll send you a link to reset your password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg bg-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <div className="rounded-md bg-zinc-700 p-3 text-center text-sm text-pink-300">{message}</div>}
      </div>
    </div>
  );
}
