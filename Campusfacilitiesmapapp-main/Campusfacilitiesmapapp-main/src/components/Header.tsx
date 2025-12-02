import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
  title?: string;
  onBackClick?: () => void;
}

export function Header({ showBackButton = false, showHomeButton = false, title = 'Campus Compass', onBackClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
      {showBackButton && (
        <button
          onClick={handleBackClick}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-[#005BAC]">{title}</h1>
      </div>
      {showHomeButton && (
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#005BAC]/10 transition-colors group"
          title="메인 화면으로"
        >
          <Home className="w-5 h-5 text-[#005BAC] group-hover:scale-110 transition-transform" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
