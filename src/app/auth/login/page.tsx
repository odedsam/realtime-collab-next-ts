'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthForm from '@/components/forms/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (data: any) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.message || 'Login failed');
    } else {
      router.push('/dashboard');
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
}
