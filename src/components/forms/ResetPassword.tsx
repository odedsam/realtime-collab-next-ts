'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or expired token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.message || 'Something went wrong');
    } catch {
      setMessage('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4">
      <div className="animate-fade-in w-full max-w-md space-y-6 rounded-2xl bg-zinc-800 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-white">Reset Your Password</h1>
        <p className="text-center text-sm text-zinc-400">Enter a new password for your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg bg-zinc-700 px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {message && <div className="rounded-md bg-zinc-700 p-3 text-center text-sm text-pink-300">{message}</div>}
      </div>
    </div>
  );
}
