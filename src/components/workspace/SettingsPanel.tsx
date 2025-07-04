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
    <div className="absolute top-0 right-0 z-20 flex flex-col h-full p-4 text-gray-300 border-l shadow-lg w-72 border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Chat Settings</h3>
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="font-bold text-teal-400 hover:text-teal-600">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="accent-teal-400"
          />
          Dark Mode
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
            className="accent-teal-400"
          />
          Notifications
        </label>

        <button
          onClick={clearChatHistory}
          className="px-3 py-2 mt-4 font-semibold text-white bg-red-600 rounded hover:bg-red-700">
          Clear Chat History
        </button>

        <button
          onClick={toggleSidebar}
          className="px-3 py-2 mt-4 font-semibold text-white bg-teal-600 rounded hover:bg-teal-700">
          {sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        </button>
      </div>
    </div>
  );
}
