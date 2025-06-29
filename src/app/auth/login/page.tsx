'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonFacebook, ButtonGoogle } from '@/components/ui/Buttons';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const RedirectFacebook = () => {
    window.location.href = '/api/auth/facebook';
  };
  const RedirectGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-lay flex min-h-screen items-center justify-center">
      <div className="card-main shad-str w-full max-w-sm p-8">
        <h1 className="text-lay mb-6 text-center text-xl font-semibold">Login</h1>

        <form onSubmit={handleSignIn} className="w-full space-y-4">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {error && <div className="text-pnk text-center text-sm">{error}</div>}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="my-4 flex flex-col items-center justify-center py-4 gap-4">
          <ButtonGoogle onClick={RedirectGoogle} disabled={true} />
          <ButtonFacebook onClick={RedirectFacebook} disabled={true} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-500 transition-colors hover:text-black">
            Don't have an account?
            <Link
              href="/auth/register"
              className="ml-2 text-sm text-blue-900 underline transition-colors hover:font-semibold hover:text-black">
              Sign Up
            </Link>
          </p>

          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-900 underline transition-colors hover:font-semibold hover:text-black">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
