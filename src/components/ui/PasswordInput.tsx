'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  name?: string;
};

export default function PasswordInput({ value, onChange, placeholder = 'Password', id, name }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-teal-600 focus:outline-none"
        aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

// usage :     <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
