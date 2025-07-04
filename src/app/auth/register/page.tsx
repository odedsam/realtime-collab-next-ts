'use client';

import AuthForm from '@/components/forms/AuthForm';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSignup = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.message || 'Signup failed');
    } else {
      router.push('/auth/login');
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
}
