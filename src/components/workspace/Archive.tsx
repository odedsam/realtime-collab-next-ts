'use client';

import { useState } from 'react';
import { Archive, ArchiveRestore, MoreHorizontal } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  isArchived?: boolean;
}

interface ArchiveControlsProps {
  users: User[];
  showArchived: boolean;
  onToggleArchiveView: () => void;
  onArchive: (userId: string) => void;
  onUnarchive: (userId: string) => void;
  expanded: boolean;
}

export function ArchiveControls({
  users,
  showArchived,
  onToggleArchiveView,
  onArchive,
  onUnarchive,
  expanded,
}: ArchiveControlsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const archivedCount = users.filter((user) => user.isArchived).length;

  if (!expanded) return null;

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
  };

  return (
    <div className="flex flex-col gap-2">
      {archivedCount > 0 && (
        <button
          onClick={onToggleArchiveView}
          className="flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded-full w-max bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          title={showArchived ? 'Show active chats' : `View ${archivedCount} archived`}>
          <Archive size={12} />
          {showArchived ? 'Back' : archivedCount}
        </button>
      )}

      {users.map((user) => (
        <div key={user.id} className="relative flex items-center group">
          <span className="mr-2 text-sm">{user.name}</span>

          {user.isArchived && <Archive size={12} className="mr-1 text-zinc-400" />}

          <button
            type="button"
            onClick={(e) => handleToggleDropdown(user.id, e)}
            className="p-1 transition-opacity rounded opacity-0 group-hover:opacity-100 hover:bg-zinc-600">
            <MoreHorizontal size={12} />
          </button>

          {activeDropdown === user.id && (
            <div className="absolute top-full right-0 z-10 mt-1 min-w-[120px] rounded-md border border-zinc-600 bg-zinc-800 shadow-lg">
              {user.isArchived ? (
                <button
                  type="button"
                  onClick={(e) => handleUnarchive(user.id, e)}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-zinc-700">
                  <ArchiveRestore size={14} />
                  Unarchive
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleArchive(user.id, e)}
                  className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-zinc-700">
                  <Archive size={14} />
                  Archive
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
