import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Coffee, 
  UtensilsCrossed, 
  BookOpen, 
  Banknote, 
  ShoppingBag, 
  Cross, 
  Dumbbell, 
  Armchair,
  Map,
  Search,
  ChevronRight,
  Bell
} from 'lucide-react';

interface MainMenuProps {
  onCategorySelect: (category: string) => void;
  onMapView: () => void;
  onSearchClick: () => void;
}

const categories = [
  { id: 'cafe', label: '카페', icon: Coffee, gradient: 'from-amber-400 to-orange-500' },
  { id: 'restaurant', label: '식당', icon: UtensilsCrossed, gradient: 'from-orange-400 to-red-500' },
  { id: 'library', label: '도서관', icon: BookOpen, gradient: 'from-blue-400 to-indigo-500' },
  { id: 'atm', label: 'ATM', icon: Banknote, gradient: 'from-green-400 to-emerald-500' },
  { id: 'convenience', label: '편의점', icon: ShoppingBag, gradient: 'from-purple-400 to-pink-500' },
  { id: 'medical', label: '의무실', icon: Cross, gradient: 'from-red-400 to-rose-500' },
  { id: 'gym', label: '체육관', icon: Dumbbell, gradient: 'from-indigo-400 to-purple-500' },
  { id: 'lounge', label: '휴게실', icon: Armchair, gradient: 'from-teal-400 to-cyan-500' },
];

export function MainMenu({ onCategorySelect, onMapView, onSearchClick }: MainMenuProps) {
  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-5 space-y-6 pb-8 max-w-2xl mx-auto">
        {/* 빠른 액션 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onMapView}
            className="group relative h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 active:scale-95"
          >
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center gap-3 text-white">
              <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Map className="w-8 h-8" />
              </div>
              <span className="text-base">지도 보기</span>
            </div>
          </button>
          
          <button
            onClick={onSearchClick}
            className="group relative h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 active:scale-95"
          >
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center gap-3 text-white">
              <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8" />
              </div>
              <span className="text-base">시설 검색</span>
            </div>
          </button>
        </div>

        {/* 카테고리 */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-gray-800">편의시설 카테고리</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 active:scale-95 border border-gray-100"
                >
                  <div className={`bg-gradient-to-br ${category.gradient} text-white rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-center text-gray-700 leading-tight">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 공지사항 */}
        <Card className="bg-white border-0 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
          <CardHeader className="pt-5">
            <CardTitle className="text-base flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                <Bell className="w-4 h-4 text-white" />
              </div>
              공지사항
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed pt-3 space-y-2">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>중앙도서관 열람실 좌석 예약제 운영</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>학생회관 리모델링 공사 안내 (11월 예정)</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>종합체육관 헬스장 이용시간 변경</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 하단 정보 */}
        <div className="text-center text-sm text-gray-400 pt-2">
          <p className="text-gray-500">백석대학교 캠퍼스 안내</p>
          <p className="text-xs mt-1.5">문의: 학생지원센터 041-550-0000</p>
        </div>
      </div>
    </div>
  );
}
