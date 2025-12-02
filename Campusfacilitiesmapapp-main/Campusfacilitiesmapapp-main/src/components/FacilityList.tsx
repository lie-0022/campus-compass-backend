import { Facility } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Coffee, UtensilsCrossed, BookOpen, Banknote, ShoppingBag, Cross, Dumbbell, Armchair, Building, Clock } from 'lucide-react';

interface FacilityListProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onFacilitySelect: (facility: Facility) => void;
}

const categoryConfig = {
  cafe: { icon: Coffee, color: 'bg-amber-500', label: '카페' },
  restaurant: { icon: UtensilsCrossed, color: 'bg-orange-500', label: '식당' },
  library: { icon: BookOpen, color: 'bg-blue-500', label: '도서관' },
  atm: { icon: Banknote, color: 'bg-green-500', label: 'ATM' },
  convenience: { icon: ShoppingBag, color: 'bg-purple-500', label: '편의점' },
  medical: { icon: Cross, color: 'bg-red-500', label: '의무실' },
  gym: { icon: Dumbbell, color: 'bg-indigo-500', label: '체육관' },
  lounge: { icon: Armchair, color: 'bg-teal-500', label: '휴게실' },
};

export function FacilityList({ facilities, selectedFacility, onFacilitySelect }: FacilityListProps) {
  if (facilities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
        <BookOpen className="w-12 h-12 mb-3 opacity-50" />
        <p>검색 결과가 없습니다</p>
        <p className="text-sm">다른 검색어나 카테고리를 선택해보세요</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      <p className="text-sm text-gray-500 sticky top-0 bg-gray-50 py-2">
        총 {facilities.length}개의 시설
      </p>
      
      {facilities.map((facility) => {
        const config = categoryConfig[facility.category];
        const Icon = config.icon;
        const isSelected = selectedFacility?.id === facility.id;

        return (
          <Card
            key={facility.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
            onClick={() => onFacilitySelect(facility)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`${config.color} text-white rounded-full p-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{facility.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {facility.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${config.color} flex-shrink-0`} variant="default">
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2 pt-0">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{facility.building} {facility.floor}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{facility.hours}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
