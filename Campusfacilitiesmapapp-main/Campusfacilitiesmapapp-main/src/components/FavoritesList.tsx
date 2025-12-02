import { Heart, MapPin, Clock, Home, LogIn } from 'lucide-react';
import { Facility, User } from '../App';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface FavoritesListProps {
  facilities: Facility[];
  onFacilityClick: (facility: Facility) => void;
  currentUser: User | null;
}

const categoryLabels = {
  cafe: '카페',
  restaurant: '식당',
  library: '도서관',
  atm: 'ATM',
  convenience: '편의점',
  medical: '의무실',
  gym: '체육관',
  lounge: '휴게실',
  transport: '통학버스',
};

export function FavoritesList({ facilities, onFacilityClick, currentUser }: FavoritesListProps) {
  const navigate = useNavigate();
  const favoriteFacilities = facilities.filter((f) => f.isFavorite);

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#005BAC]/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#005BAC]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-gray-900 text-lg">즐겨찾기</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentUser ? `${favoriteFacilities.length}개 시설` : '로그인이 필요합니다'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#005BAC]/10 transition-colors group"
            title="메인 화면으로"
          >
            <Home className="w-5 h-5 text-[#005BAC] group-hover:scale-110 transition-transform" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        {!currentUser ? (
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#005BAC]/10 flex items-center justify-center">
                <LogIn className="w-8 h-8 text-[#005BAC]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">로그인이 필요합니다</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  즐겨찾기 기능을 사용하려면<br />
                  로그인이 필요합니다
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-[#005BAC] hover:bg-[#005BAC]/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인하기
                </Button>
              </div>
            </div>
          </div>
        ) : favoriteFacilities.length === 0 ? (
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center">
                <Heart className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-gray-700 text-sm mb-1.5">즐겨찾기가 비어있습니다</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  자주 찾는 편의시설을<br />
                  즐겨찾기에 추가해보세요
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {favoriteFacilities.map((facility) => (
              <button
                key={facility.id}
                onClick={() => onFacilityClick(facility)}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all active:scale-98 text-left"
              >
                <div className="flex items-start gap-3.5">
                  {facility.image ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                      <ImageWithFallback 
                        src={facility.image} 
                        alt={facility.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005BAC]/5 to-gray-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#005BAC]" strokeWidth={2} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 text-sm mb-2 truncate">{facility.name}</h3>

                    <Badge
                      variant="secondary"
                      className="bg-[#005BAC]/10 text-[#005BAC] text-xs px-2 py-0.5 mb-2.5"
                    >
                      {categoryLabels[facility.category]}
                    </Badge>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="truncate">
                          {facility.building} {facility.floor}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="truncate">{facility.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}