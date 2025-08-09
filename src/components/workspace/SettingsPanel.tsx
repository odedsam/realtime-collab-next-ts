'use client';

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
          className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-400 px-3 py-2 font-medium text-zinc-900 shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 hover:from-red-400 hover:via-rose-400 hover:to-orange-200">
          Clear Chat History
        </button>

        <button
          onClick={toggleSidebar}
          className="mt-4 cursor-pointer rounded-xl bg-orange-200 px-3 py-2 font-semibold text-zinc-900 shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-105 hover:border-2 hover:border-amber-700 hover:bg-orange-300 hover:text-black">
          {sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        </button>
      </div>
    </div>
  );
}
