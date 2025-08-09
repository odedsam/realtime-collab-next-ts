'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuth';
import { register } from '@/services/user';
import AuthForm from '@/components/forms/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignup = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setUser(result.user);
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Signup failed');
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
    </div>
  );
}
