'use client';

interface SettingsPanelProps {
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

  return (
    <div className="absolute z-20 flex h-full w-72 flex-col border-l border-zinc-700 bg-zinc-900 p-4 text-gray-300 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chat Settings</h3>
        <button onClick={onClose} aria-label="Close settings" className="cursor-pointer font-bold text-lime-400 hover:text-lime-600">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="cursor-pointer accent-lime-400" />
          Dark Mode
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} className="cursor-pointer accent-lime-400" />
          Notifications
        </label>

        <button
          onClick={clearChatHistory}
          className="mt-4 cursor-pointer rounded bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700">
          Clear Chat History
        </button>

        <button
          onClick={toggleSidebar}
          className="mt-4 cursor-pointer rounded bg-lime-600 px-3 py-2 font-semibold text-white hover:bg-lime-700">
          {sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        </button>
      </div>
    </div>
  );
}
