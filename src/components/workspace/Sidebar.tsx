'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface UsersSidebarProps {
  collaborators: User[];
  activeChatUser: string | null;
  onSelectUser: (userId: string) => void;
}

export default function UsersSidebar({ collaborators, activeChatUser, onSelectUser }: UsersSidebarProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => setExpanded((v) => !v);

  return (
    <aside
      className={`transition-width flex flex-col border-r border-zinc-700 bg-zinc-900 duration-300 ease-in-out ${expanded ? 'w-72' : 'w-16'}`}>
      {/* Header + toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700">
        {expanded ? <h2 className="text-xl font-bold text-teal-400">Users</h2> : <div className="w-6 h-6" />}
        <button
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={toggleSidebar}
          className="p-1 text-teal-400 rounded-md hover:bg-zinc-700">
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Users list */}
      <ul className="flex flex-col items-center flex-1 gap-2 px-2 py-4 overflow-y-auto no-scrollbar">
        {collaborators.map(({ id, name, avatar }) => {
          const isActive = activeChatUser === id;

          return (
            <li
              key={id}
              onClick={() => onSelectUser(id)}
              title={name}
              className={`flex cursor-pointer rounded-full border border-teal-600 bg-zinc-700 shadow-inner transition-colors duration-200 select-none hover:bg-teal-600 ${expanded ? 'w-full gap-3 px-3 py-2' : 'w-12 justify-center p-1'} ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300'}`}>
              {avatar ? (
                <img src={avatar} alt={name} className="w-8 h-8 rounded-full ring-2 ring-teal-400" loading="lazy" />
              ) : (
                <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-600 text-zinc-400">
                  ?
                </div>
              )}

              {expanded && (
                <span className={`max-w-[100px] truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
