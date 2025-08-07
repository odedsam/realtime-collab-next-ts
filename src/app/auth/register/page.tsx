'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppAuth } from '@/store/useAuth';
import { register } from '@/services/user';
import AuthForm from '@/components/forms/AuthForm';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAppAuth((state) => state.setUser);

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
      if(result.user){
        router.push('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Signup failed');
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignup} error={error} />;
}
