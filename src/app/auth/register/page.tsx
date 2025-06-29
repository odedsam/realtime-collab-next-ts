'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ButtonGoogle, ButtonFacebook } from '@/components/ui/Buttons';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const RedirectFacebook = () => {
    window.location.href = '/api/auth/facebook';
  };
  const RedirectGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // בדיקה עם Zod
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat().join(', '));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-lay flex min-h-screen items-center justify-center">
      <div className="card-main w-full max-w-sm space-y-4 rounded-xl p-8 shadow-md">
        <h1 className="text-center text-xl font-semibold text-black">Sign Up</h1>
        <form onSubmit={handleRegister} className="w-full space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
        <div className="my-4 flex flex-col items-center justify-center gap-4 py-4">
          <ButtonGoogle onClick={RedirectGoogle} disabled={true} />
          <ButtonFacebook onClick={RedirectFacebook} disabled={true} />
        </div>
        <p className="text-center text-sm text-blue-500 transition-colors hover:text-black">
          Already have an account?
          <Link href="/auth/login" className="ml-2 text-sm text-blue-900 underline transition-colors hover:font-semibold hover:text-black">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
