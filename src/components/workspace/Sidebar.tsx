'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Archive, ArchiveRestore } from 'lucide-react';
import { SearchComponent } from './Search';
import SettingsPanel from './SettingsPanel';
import SettingsButton from '../ui/SettingsButton';

interface User {
  id: string;
  name: string;
  avatar?: string;
  isArchived?: boolean;
}

interface UsersSidebarProps {
  collaborators: User[];
  activeChatUser: string | null;
  onSelectUser: (userId: string) => void;
  onArchive: (userId: string) => void;
  onUnarchive: (userId: string) => void;
}

export default function UsersSidebar({
  collaborators,
  activeChatUser,
  onSelectUser,
  onArchive,
  onUnarchive,
}: UsersSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Example settings states
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleSidebar = () => setExpanded((v) => !v);
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleToggleArchiveView = () => setShowArchived((prev) => !prev);

  const handleToggleDropdown = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleArchive = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(userId);
    setActiveDropdown(null);
  };

  const handleUnarchive = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUnarchive(userId);
    setActiveDropdown(null);
    setShowArchived(false);
  };

  const clearChatHistory = () => {
    alert('Chat history cleared!');
  };

  const filteredUsers = collaborators.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived ? user.isArchived : !user.isArchived;
    return matchesSearch && matchesArchive;
  });
  const archivedCount = collaborators.filter((user) => user.isArchived).length;

  return (
    <>
      <aside
        className={`flex flex-col border-r border-zinc-700 bg-zinc-900 duration-300 ease-in-out ${
          expanded ? 'w-72' : 'w-16'
        }`}
        style={{ height: '100vh' }}>
        {/* Header + toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700">
          {expanded ? (
            <h2 className="text-xl font-bold text-teal-400">Chats</h2>
          ) : (
            <div className="w-6 h-6" />
          )}
          <button
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            onClick={toggleSidebar}
            className="p-1 text-teal-400 rounded-md hover:bg-zinc-700">
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search Component */}
        <SearchComponent onSearch={handleSearch} expanded={expanded} placeholder="Search" />

        {/* Archive toggle */}
        {archivedCount > 0 && expanded && (
          <button
            onClick={handleToggleArchiveView}
            className="flex items-center gap-1 px-2 py-1 m-2 text-xs transition-colors rounded-full w-max bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            title={showArchived ? 'Show active chats' : `View ${archivedCount} archived`}>
            <Archive size={12} />
            {showArchived ? 'Back' : archivedCount}
          </button>
        )}

        {/* Users list */}
        <ul className="flex flex-col items-center flex-1 gap-2 px-2 py-4 overflow-y-auto no-scrollbar">
          {filteredUsers.map(({ id, name, avatar, isArchived }) => {
            const isActive = activeChatUser === id;

            return (
              <li
                key={id}
                onClick={() => onSelectUser(id)}
                title={name}
                className={`relative flex cursor-pointer rounded-full border border-teal-600 bg-zinc-700 shadow-inner transition-colors duration-200 select-none hover:bg-teal-600 ${
                  expanded ? 'w-full gap-3 px-3 py-2' : 'w-12 justify-center p-1'
                } ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300'}`}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-8 h-8 rounded-full ring-2 ring-teal-400"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-600 text-zinc-400">
                    ?
                  </div>
                )}

                {expanded && (
                  <span
                    className={`max-w-[100px] truncate text-sm font-semibold ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}>
                    {name}
                  </span>
                )}

                {/* Archive toggle icon */}
                {expanded && (
                  <div className="relative flex items-center ml-auto group">
                    {isArchived && <Archive size={12} className="mr-1 text-zinc-400" />}
                    <button
                      type="button"
                      onClick={(e) => handleToggleDropdown(id, e)}
                      className="p-1 transition-opacity rounded opacity-0 group-hover:opacity-100 hover:bg-zinc-600">
                      <MoreHorizontal size={12} />
                    </button>

                    {activeDropdown === id && (
                      <div className="absolute top-full right-0 z-10 mt-1 min-w-[120px] rounded-md border border-zinc-600 bg-zinc-800 shadow-lg">
                        {isArchived ? (
                          <button
                            type="button"
                            onClick={(e) => handleUnarchive(id, e)}
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-zinc-700">
                            <ArchiveRestore size={14} />
                            Unarchive
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleArchive(id, e)}
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-zinc-700">
                            <Archive size={14} />
                            Archive
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <SettingsButton expanded={expanded} onOpenSettings={() => setSettingsOpen(true)} />
      </aside>

      {settingsOpen && (
        <SettingsPanel
          expanded={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((v) => !v)}
          notificationsEnabled={notificationsEnabled}
          toggleNotifications={() => setNotificationsEnabled((v) => !v)}
          clearChatHistory={clearChatHistory}
          sidebarExpanded={expanded}
          toggleSidebar={toggleSidebar}
        />
      )}
    </>
  );
}
