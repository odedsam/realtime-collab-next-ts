'use client';

import { useState, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
}

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  className?: string;
}
export interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  className?: string;
}

export interface CheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  className?: string;
  options: { value: string; label: string }[];
}
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  className?: string;
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Input = ({ label, id, className, ...rest }: TextInputProps) => {
  return (
    <div className="w-full max-w-md">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={cn(
          'w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none',
          className,
        )}
        {...rest}
      />
    </div>
  );
};

export const PasswordInput = ({ label, id, className, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className={cn(
          'w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none',
          className,
        )}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-teal-600 focus:outline-none"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}>
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export const CheckboxInput = ({ label, id, className, ...rest }: CheckboxInputProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-gray-700 select-none',
        rest.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}>
      <input
        type="checkbox"
        id={id}
        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
        {...rest}
      />
      {label}
    </label>
  );
};

export const RadioInput = ({ label, id, name, className, ...rest }: RadioInputProps) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-gray-700 select-none',
        rest.disabled && 'cursor-not-allowed opacity-50',
        className,
      )}>
      <input
        type="radio"
        id={id}
        name={name}
        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
        {...rest}
      />
      {label}
    </label>
  );
};

export const Textarea = ({ label, id, className, rows = 4, resize = 'vertical', ...rest }: TextareaProps) => {
  return (
    <div className="w-full max-w-md">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none',
          resize === 'none' && 'resize-none',
          resize === 'both' && 'resize',
          resize === 'horizontal' && 'resize-x',
          resize === 'vertical' && 'resize-y',
          className,
        )}
        {...rest}
      />
    </div>
  );
};

export const Select = ({ label, id, className, options, ...rest }: SelectProps) => {
  return (
    <div className="w-full max-w-md">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          'w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none',
          className,
        )}
        {...rest}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

/*
'use client';

import { useState } from 'react';
import { Input, PasswordInput, CheckboxInput, RadioInput, Textarea, Select } from '@/components/ui';

export default function FormExample() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [gender, setGender] = useState('male');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('israel');

  return (
    <form className="max-w-md space-y-6">
      <Input
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />

      <CheckboxInput id="agree" label="I agree to the terms" checked={agree} onChange={(e) => setAgree(e.target.checked)} />

      <Textarea
        id="bio"
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about yourself"
        rows={5}
        resize="vertical"
      />

      <Select
        id="country"
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={[
          { value: 'israel', label: 'Israel' },
          { value: 'usa', label: 'USA' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'canada', label: 'Canada' },
        ]}
      />
      <fieldset>
        <legend className="mb-2 font-semibold text-gray-700">Gender</legend>
        <RadioInput id="male" name="gender" label="Male" checked={gender === 'male'} onChange={() => setGender('male')} />
        <RadioInput id="female" name="gender" label="Female" checked={gender === 'female'} onChange={() => setGender('female')} />
      </fieldset>
    </form>
  );
}

*/
