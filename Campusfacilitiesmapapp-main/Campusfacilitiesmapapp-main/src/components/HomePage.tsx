import { useState } from 'react';
import { MapView } from './MapView';
import { FavoritesList } from './FavoritesList';
import { SettingsView } from './SettingsView';
import { FacilityDetailSheet } from './FacilityDetailSheet';
import { Map, Heart, Settings } from 'lucide-react';
import { Facility, GroupedFacility, User } from '../App';
import { useNavigate } from 'react-router-dom';

type View = 'map' | 'favorites' | 'settings';

interface HomePageProps {
  facilities: Facility[];
  onToggleFavorite: (facilityId: number) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function HomePage({ facilities, onToggleFavorite, currentUser, onLogout }: HomePageProps) {
  const [currentView, setCurrentView] = useState<View>('map');
  const [selectedGroupedFacility, setSelectedGroupedFacility] = useState<GroupedFacility | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const handleFacilityClick = (facility: Facility) => {
    navigate(`/facility/${facility.id}`);
  };

  const handleGroupedFacilityClick = (groupedFacility: GroupedFacility) => {
    setSelectedGroupedFacility(groupedFacility);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFC]">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'map' && (
          <MapView
            facilities={facilities}
            onGroupedFacilityClick={handleGroupedFacilityClick}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
        {currentView === 'favorites' && (
          <FavoritesList 
            facilities={facilities}
            onFacilityClick={handleFacilityClick}
            currentUser={currentUser}
          />
        )}
        {currentView === 'settings' && (
          <SettingsView 
            currentUser={currentUser}
            onLogout={onLogout}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setCurrentView('map')}
            className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors ${
              currentView === 'map'
                ? 'text-[#005BAC]'
                : 'text-gray-400'
            }`}
          >
            <Map className="w-5 h-5" strokeWidth={currentView === 'map' ? 2.5 : 2} />
            <span className="text-xs">지도</span>
          </button>

          <button
            onClick={() => setCurrentView('favorites')}
            className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors ${
              currentView === 'favorites'
                ? 'text-[#005BAC]'
                : 'text-gray-400'
            }`}
          >
            <Heart className="w-5 h-5" strokeWidth={currentView === 'favorites' ? 2.5 : 2} />
            <span className="text-xs">즐겨찾기</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors ${
              currentView === 'settings'
                ? 'text-[#005BAC]'
                : 'text-gray-400'
            }`}
          >
            <Settings className="w-5 h-5" strokeWidth={currentView === 'settings' ? 2.5 : 2} />
            <span className="text-xs">설정</span>
          </button>
        </div>
      </nav>

      {/* Grouped Facility Detail Sheet */}
      {selectedGroupedFacility && (
        <FacilityDetailSheet
          groupedFacility={selectedGroupedFacility}
          onClose={() => setSelectedGroupedFacility(null)}
          onToggleFavorite={onToggleFavorite}
          onFacilityClick={(facility) => {
            setSelectedGroupedFacility(null);
            handleFacilityClick(facility);
          }}
        />
      )}
    </div>
  );
}