import { useNavigate } from 'react-router-dom';
import { Compass, Store, Wrench, BookOpen, Bus } from 'lucide-react';

const categories = [
  {
    id: 'map',
    title: '지도 & 길찾기',
    icon: Compass,
    color: '#0066CC',
    bgColor: 'bg-[#0066CC]',
    textColor: 'text-[#0066CC]',
    route: '/map',
  },
  {
    id: 'convenience',
    title: '편의시설',
    icon: Store,
    color: '#00A066',
    bgColor: 'bg-[#00A066]',
    textColor: 'text-[#00A066]',
    route: '/map',
  },
  {
    id: 'service',
    title: '생활 서비스',
    icon: Wrench,
    color: '#FF6B35',
    bgColor: 'bg-[#FF6B35]',
    textColor: 'text-[#FF6B35]',
    route: '/map',
  },
  {
    id: 'study',
    title: '문학 & 학습 공간',
    icon: BookOpen,
    color: '#8B5CF6',
    bgColor: 'bg-[#8B5CF6]',
    textColor: 'text-[#8B5CF6]',
    route: '/map',
  },
  {
    id: 'transport',
    title: '교통 & 주차',
    icon: Bus,
    color: '#EF4444',
    bgColor: 'bg-[#EF4444]',
    textColor: 'text-[#EF4444]',
    route: '/map',
  },
];

const colorGuide = [
  { name: '#0066CC', color: '#0066CC' },
  { name: '#00A066', color: '#00A066' },
  { name: '#FF6B35', color: '#FF6B35' },
  { name: '#8B5CF6', color: '#8B5CF6' },
  { name: '#EF4444', color: '#EF4444' },
];

export function WelcomePage() {
  const navigate = useNavigate();

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-2">Campus Compass</h1>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.route)}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95"
              >
                {/* Icon Circle */}
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-gray-900 text-center">{category.title}</h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}