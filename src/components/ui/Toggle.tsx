'use client';

import { cn } from '@/utils';

export interface ToggleProps {
  id?: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export const Toggle = ({ label, checked, onChange, id, disabled = false, className }: ToggleProps) => {
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-center gap-2', disabled && 'cursor-not-allowed opacity-50', className)}>
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="cursor-pointer accent-lime-400" />
      {label}
    </label>
  );
};

export const SingleToggle = ({ label, checked, onChange, id, disabled = false, className }: ToggleProps) => {
  return (
    <div
      className={cn('flex cursor-pointer items-center justify-between select-none', disabled && 'cursor-not-allowed opacity-50', className)}
      onClick={() => !disabled && onChange()}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onChange();
        }
      }}>
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer accent-lime-400"
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
      />
    </div>
  );
};

// Usage :

// ! Toggle

/* 'use client';

import  { useState } from 'react';
import { SingToggle } from './Toggle';

export default function SomeComponent () {
    { id: 'dark-mode-toggle', label: 'Dark Mode', checked: darkMode, onChange: toggleDarkMode },
    { id: 'notifications-toggle', label: 'Notifications', checked: notificationsEnabled, onChange: toggleNotifications },

  return (
    <div className="p-4">
     <div className="flex flex-col gap-4">
        {toggles.map(({ id, label, checked, onChange }) => (
          <Toggle key={id} id={id} label={label} checked={checked} onChange={onChange} />
        ))}

    </div>
  );
}
 */

// Usage :

// ! Single Toggle

/* 'use client';

import  { useState } from 'react';
import { SingleToggle } from './Toggle';

export default function SomeComponent () {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4">
      <SingleToggle
        id="single-toggle-example"
        label="Enable Feature"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <p className="mt-2 text-gray-300">Status: {enabled ? 'Enabled' : 'Disabled'}</p>
    </div>
  );
}
 */
