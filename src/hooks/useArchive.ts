interface User {
  id: string;
  name: string;
  isArchived: boolean;
}

interface ArchiveManagerProps {
  users: User[];
  onArchive: (userId: string) => void;
  onUnarchive: (userId: string) => void;
  searchQuery: string;
  showArchived: boolean;
}

export function useArchiveManager({
  users,
  onArchive,
  onUnarchive,
  searchQuery,
  showArchived,
}: ArchiveManagerProps) {

  const archivedCount = users.filter(user => user.isArchived).length;

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived ? user.isArchived : !user.isArchived;
    return matchesSearch && matchesArchive;
  });

  const handleArchive = (userId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onArchive(userId);
  };

  const handleUnarchive = (userId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUnarchive(userId);
  };

  return {
    archivedCount,
    filteredUsers,
    handleArchive,
    handleUnarchive,
  };
}
