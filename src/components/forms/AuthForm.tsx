'use client';

import { useState } from 'react';
import { GoogleButton, FacebookButton } from '../ui/Buttons';
import { loginSchema, signupSchema, LoginSchema, SignupSchema } from '@/lib/validation/auth';

export interface AuthFormProps {
  mode: 'login' | 'signup' | 'testlogin';
  onSubmit: (data: LoginSchema | SignupSchema) => void;
  error?: string;
}

export default function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = mode === 'login' ? loginSchema.safeParse(formData) : signupSchema.safeParse(formData);

    if (!result.success) {
      setFormError(result.error.errors[0].message);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-zinc-700 p-8 shadow">
        <div>
          <h2 className="text-center text-2xl font-bold text-white">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        {formError && <p className="text-center text-sm text-red-500">{formError}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none text-white sm:text-sm"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none sm:text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none sm:text-sm text-white"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none sm:text-sm text-white"
                />
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-white">
                <input
                  type="checkbox"
                  name="remember"
                  onChange={handleChange}
                  className="mr-2 rounded border-gray-300 text-orange-600 accent-orange-400 shadow-sm focus:ring-orange-500"
                />
                Remember me
              </label>
              <a href="#" className="text-sm text-orange-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="flex w-full cursor-pointer justify-center rounded-md bg-orange-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-orange-400 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:outline-none">
              {mode === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span className="w-1/5 border-t border-gray-300"></span>
          <span className="text-orange-300">Or continue with</span>
          <span className="w-1/5 border-t border-gray-300"></span>
        </div>

        <div className="flex gap-4">
          <GoogleButton className={'font-sans'} label={'Google'} />
          <FacebookButton className={'font-sans'} label={'Facebook'} />
        </div>
      </div>
    </div>
  );
}
