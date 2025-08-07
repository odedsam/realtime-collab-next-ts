import { useDebounce } from '@/hooks/useDebounce';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchComponentProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  expanded?: boolean;
}

export function SearchComponent({
  onSearch,
  placeholder = 'Search',
  expanded = true,
}: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (!expanded) {
    return (
      <div className="flex justify-center px-2 py-2">
        <button
          className="p-2 text-lime-400 transition-colors rounded-md hover:bg-zinc-700"
          title="Search users">
          <Search size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-2">
      <div className="relative">
        <Search
          size={16}
          className="absolute transform -translate-y-1/2 top-1/2 left-3 text-zinc-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-sm text-white transition-colors border rounded-md border-zinc-600 bg-zinc-800 placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute transition-colors transform -translate-y-1/2 top-1/2 right-3 text-zinc-400 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
