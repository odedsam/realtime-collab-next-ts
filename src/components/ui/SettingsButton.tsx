'use client';

import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  expanded: boolean;
  onOpenSettings: () => void;
}

export default function SettingsButton({ expanded, onOpenSettings }: SettingsButtonProps) {
  return (
    <div className={`flex border-t border-zinc-700 p-3 ${expanded ? 'px-4' : ''}`}>
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex gap-2 px-3 py-2 text-sm text-lime-200 rounded-md hover:bg-zinc-700"
        title="Settings">
        <Settings size={18} />
        {expanded && <span>Settings</span>}
      </button>
    </div>
  );
}
