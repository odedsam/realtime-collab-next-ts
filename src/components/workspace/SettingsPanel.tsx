'use client';

import { ActionButton } from '../ui/Buttons';
import { Toggle } from '../ui/Toggle';

export interface SettingsPanelProps {
  expanded: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  clearChatHistory: () => void;
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export default function SettingsPanel({
  expanded,
  onClose,
  darkMode,
  toggleDarkMode,
  notificationsEnabled,
  toggleNotifications,
  clearChatHistory,
  sidebarExpanded,
  toggleSidebar,
}: SettingsPanelProps) {
  if (!expanded) return null;

  const toggles = [
    { id: 'dark-mode-toggle', label: 'Dark Mode', checked: darkMode, onChange: toggleDarkMode },
    { id: 'notifications-toggle', label: 'Notifications', checked: notificationsEnabled, onChange: toggleNotifications },
  ];

  return (
    <div className="absolute z-20 flex h-full w-72 flex-col border-l border-zinc-700 bg-zinc-900 p-4 text-gray-300 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chat Settings</h3>
        <button onClick={onClose} aria-label="Close settings" className="cursor-pointer font-bold text-lime-400 hover:text-lime-600">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {toggles.map(({ id, label, checked, onChange }) => (
          <Toggle key={id} id={id} label={label} checked={checked} onChange={onChange} />
        ))}

        <ActionButton label="Clear Chat History" onClick={clearChatHistory} variant="danger" />
        <ActionButton label={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'} onClick={toggleSidebar} variant="sidebar" />
      </div>
    </div>
  );
}
