//login
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="bg-lay flex min-h-screen items-center justify-center">
      <div className="card shad-str w-full max-w-sm space-y-4 p-8">
        <h1 className="text-lay text-center text-xl font-semibold">Login</h1>
        <input
          type="email"
          className="w-full rounded border p-2 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded border p-2 text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="btn">
          Login
        </button>
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-blue-700 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
