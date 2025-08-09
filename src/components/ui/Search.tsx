import { useDebounce } from '@/hooks/useDebounce';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchComponentProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  expanded?: boolean;
}

export function SearchComponent({ onSearch, placeholder = 'Search', expanded = true }: SearchComponentProps) {
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
        <button className="rounded-md p-2 text-lime-400 transition-colors hover:bg-zinc-700" title="Search users">
          <Search size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-2">
      <div className="relative">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 transform text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-zinc-600 bg-zinc-800 py-2 pr-10 pl-10 text-sm text-white placeholder-zinc-400 transition-colors focus:border-transparent focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-zinc-400 transition-colors hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
