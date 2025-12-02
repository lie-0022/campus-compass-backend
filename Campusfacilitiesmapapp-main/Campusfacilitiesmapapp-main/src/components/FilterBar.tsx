import { Input } from './ui/input';
import { Button } from './ui/button';
import { Coffee, UtensilsCrossed, BookOpen, Banknote, ShoppingBag, Cross, Dumbbell, Armchair, Search } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories = [
  { id: 'all', label: '전체', icon: null, color: 'bg-gray-500' },
  { id: 'cafe', label: '카페', icon: Coffee, color: 'bg-amber-500' },
  { id: 'restaurant', label: '식당', icon: UtensilsCrossed, color: 'bg-orange-500' },
  { id: 'library', label: '도서관', icon: BookOpen, color: 'bg-blue-500' },
  { id: 'atm', label: 'ATM', icon: Banknote, color: 'bg-green-500' },
  { id: 'convenience', label: '편의점', icon: ShoppingBag, color: 'bg-purple-500' },
  { id: 'medical', label: '의무실', icon: Cross, color: 'bg-red-500' },
  { id: 'gym', label: '체육관', icon: Dumbbell, color: 'bg-indigo-500' },
  { id: 'lounge', label: '휴게실', icon: Armchair, color: 'bg-teal-500' },
];

export function FilterBar({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: FilterBarProps) {
  return (
    <div className="bg-white border-b px-4 py-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="시설명 또는 건물명 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 ${isSelected ? category.color + ' hover:opacity-90' : ''}`}
            >
              {Icon && <Icon className="w-4 h-4 mr-1" />}
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
