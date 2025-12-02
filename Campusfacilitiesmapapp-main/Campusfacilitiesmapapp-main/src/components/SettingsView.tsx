import { 
  Settings, 
  Palette, 
  Bell, 
  MapPin, 
  Info, 
  Shield,
  ChevronRight,
  Moon,
  Home,
  LogIn,
  LogOut,
  UserCircle
} from 'lucide-react';
import { Switch } from './ui/switch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../App';
import { Button } from './ui/button';

interface SettingsViewProps {
  currentUser: User | null;
  onLogout: () => void;
}

export function SettingsView({ currentUser, onLogout }: SettingsViewProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleLogout = () => {
    onLogout();
    navigate('/map');
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#005BAC]/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#005BAC]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-gray-900 text-lg">설정</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                앱 환경설정 및 정보
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

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-4">
          {/* 계정 정보 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </div>
              <h2 className="text-gray-900 text-sm">계정</h2>
            </div>

            {currentUser ? (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">로그인 계정</p>
                  <p className="text-gray-900 text-sm">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentUser.email}</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 text-center py-2">
                  로그인하여 즐겨찾기 기능을 사용하세요
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#005BAC] hover:bg-[#005BAC]/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              </div>
            )}
          </div>

          {/* 테마 설정 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <Palette className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </div>
              <h2 className="text-gray-900 text-sm">테마</h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-gray-500" strokeWidth={2} />
                <div>
                  <p className="text-gray-900 text-sm">다크모드</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    어두운 화면으로 변경
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-[#005BAC]"
              />
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </div>
              <h2 className="text-gray-900 text-sm">알림</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">푸시 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  공지사항 및 운영시간 변경
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-[#005BAC]"
              />
            </div>
          </div>

          {/* 위치 설정 */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gray-600" strokeWidth={2} />
              </div>
              <h2 className="text-gray-900 text-sm">위치</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-sm">위치 추적</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  현재 위치 기반 안내
                </p>
              </div>
              <Switch
                checked={locationTracking}
                onCheckedChange={setLocationTracking}
                className="data-[state=checked]:bg-[#005BAC]"
              />
            </div>
          </div>

          {/* 정보 메뉴 */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-gray-500" strokeWidth={2} />
                <span className="text-gray-900 text-sm">앱 정보</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-gray-500" strokeWidth={2} />
                <span className="text-gray-900 text-sm">개인정보 처리방침</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </button>
          </div>

          {/* App Version */}
          <div className="text-center space-y-0.5 pt-6 pb-8">
            <p className="text-xs text-gray-500">Campus Compass</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}