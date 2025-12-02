import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-4 h-4" strokeWidth={2} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="시설명 검색..."
        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6F7] rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#005BAC]/20 placeholder:text-gray-400 text-sm transition-all"
      />
    </div>
  );
}
