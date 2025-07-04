'use client';

interface Collaborator {
  id: string;
  avatar?: string;
  name: string;
}

interface Props {
  title: string;
  collaborators: Collaborator[];
}

export default function CollaboratorsHeader({ title, collaborators }: Props) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-700 bg-zinc-800">
      <h1 className="max-w-[60%] truncate text-3xl font-extrabold text-teal-400">{title}</h1>
      <div className="no-scrollbar flex max-w-[35%] items-center gap-3 overflow-x-auto">
        {collaborators.map(({ id, avatar, name }) => (
          <div
            key={id}
            title={name}
            className="flex items-center gap-2 px-3 py-1 border border-teal-600 rounded-full shadow-inner bg-zinc-700">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                loading="lazy"
                className="w-8 h-8 rounded-full ring-2 ring-teal-400"
              />
            ) : (
              <div className="grid w-8 h-8 text-xs font-semibold rounded-full select-none place-content-center bg-zinc-600 text-zinc-400">
                ?
              </div>
            )}
            <span className="max-w-[100px] truncate text-sm font-semibold text-gray-200">
              {name}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}
