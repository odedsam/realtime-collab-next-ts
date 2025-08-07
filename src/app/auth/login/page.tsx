'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/user';
import { useAppAuth } from '@/store/useAuth';
import AuthForm from '@/components/forms/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAppAuth((state) => state.setUser);

  const handleLogin = async (data: { email: string; password: string; remember?: boolean }) => {
    try {
      const result = await login(data);
      setUser(result.user);
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Login failed');
    }
  };

  return <AuthForm mode="testlogin" onSubmit={handleLogin} error={error} />;
}
