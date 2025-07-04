'use client';

interface Collaborator {
  id: string;
  avatar?: string;
  name: string;
}

interface Props {
  collaborators: Collaborator[];
  onSelectUser: (id: string) => void;
  activeUserId: string | null;
}

export default function CollaboratorsSidebar({ collaborators, onSelectUser, activeUserId }: Props) {
  return (
    <aside className="flex flex-col gap-4 p-4 overflow-y-auto border-r w-72 rounded-l-2xl border-zinc-700 bg-zinc-900">
      <h2 className="mb-4 text-xl font-bold text-teal-400">👥 Collaborators</h2>
      {collaborators.map(({ id, avatar, name }) => (
        <button
          key={id}
          onClick={() => onSelectUser(id)}
          title={name}
          className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 ${
            activeUserId === id ? 'bg-teal-600 text-white shadow-lg' : 'bg-zinc-800 text-gray-300 hover:bg-teal-900'
          }`}>
          {avatar ? (
            <img src={avatar} alt={name} loading="lazy" className="w-10 h-10 rounded-full ring-2 ring-teal-400" />
          ) : (
            <div className="grid w-10 h-10 text-sm font-semibold rounded-full select-none place-content-center bg-zinc-700 text-zinc-400">
              ?
            </div>
          )}
          <span className="truncate">{name}</span>
        </button>
      ))}
    </aside>
  );
}
