'use client';
import { useState } from 'react';
export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Check your inbox for a password reset link!');
      } else {
        setMessage(data.error || 'Something went wrong!');
      }
    } catch (error) {
      setMessage('Error sending request!');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
