import { 
  Coffee, 
  UtensilsCrossed, 
  BookOpen, 
  Banknote, 
  ShoppingBag, 
  Cross, 
  Dumbbell, 
  Armchair,
  LayoutGrid,
  Bus
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: '전체', icon: LayoutGrid },
  { id: 'cafe', label: '카페', icon: Coffee },
  { id: 'restaurant', label: '식당', icon: UtensilsCrossed },
  { id: 'library', label: '도서관', icon: BookOpen },
  { id: 'convenience', label: '편의점', icon: ShoppingBag },
  { id: 'lounge', label: '휴게실', icon: Armchair },
  { id: 'gym', label: '체육관', icon: Dumbbell },
  { id: 'medical', label: '의무실', icon: Cross },
  { id: 'transport', label: '통학버스', icon: Bus },
  { id: 'atm', label: 'ATM', icon: Banknote },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2.5 px-5">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                isSelected
                  ? 'bg-[#005BAC] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
