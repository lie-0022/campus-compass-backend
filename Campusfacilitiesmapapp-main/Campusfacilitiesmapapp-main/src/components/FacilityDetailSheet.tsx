import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Facility, GroupedFacility } from '../App';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Heart, 
  Share2,
  Building2,
  Info,
  Phone,
  ExternalLink,
  Star,
  Users,
  Check,
  ChevronDown,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';
import { useState } from 'react';

interface FacilityDetailSheetProps {
  facility?: Facility | null;
  groupedFacility?: GroupedFacility | null;
  onClose: () => void;
  onToggleFavorite: (facilityId: number) => void;
  onFacilityClick?: (facility: Facility) => void;
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

export function FacilityDetailSheet({ facility, groupedFacility, onClose, onToggleFavorite, onFacilityClick }: FacilityDetailSheetProps) {
  if (!facility && !groupedFacility) return null;

  const [copied, setCopied] = useState(false);
  const [openFloors, setOpenFloors] = useState<string[]>([]);

  // 그룹화된 시설의 경우 첫 번째 층을 기본으로 열어둠
  useState(() => {
    if (groupedFacility && groupedFacility.floors.length > 0) {
      setOpenFloors([groupedFacility.floors[0].floor]);
    }
  });

  const toggleFloor = (floor: string) => {
    setOpenFloors(prev => 
      prev.includes(floor) 
        ? prev.filter(f => f !== floor)
        : [...prev, floor]
    );
  };

  // 현재 운영 중인지 확인하는 함수
  const isOpen = () => {
    if (!facility) return false;
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = 일요일, 6 = 토요일
    
    // 주말 체크
    if (currentDay === 0 || currentDay === 6) {
      return false; // 대부분의 시설이 주말에 닫음
    }
    
    // 24시간 운영
    if (facility.hours.includes('24시간')) {
      return true;
    }
    
    // 평일 운영시간 체크 (간단한 구현)
    if (facility.hours.includes('평일')) {
      // 대부분 09:00-18:00 사이 운영
      return currentHour >= 9 && currentHour < 18;
    }
    
    return false;
  };

  const handleGetDirections = () => {
    if (!facility) return;
    // 네이버 지도 앱/웹으로 길찾기
    const { latitude, longitude, name } = facility;
    
    // 모바일에서 네이버 지도 앱으로 열기 시도
    const naverMapAppUrl = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(name)}&appname=com.campuscompass`;
    
    // 웹 브라우저에서 네이버 지도로 열기
    const naverMapWebUrl = `https://map.naver.com/v5/search/${encodeURIComponent(name)}?c=${longitude},${latitude},16,0,0,0,dh`;
    
    // 모바일 앱 우선, 실패 시 웹으로
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // 모바일에서는 앱 실행 시도
      window.location.href = naverMapAppUrl;
      
      // 앱이 없으면 2초 후 웹으로 리다이렉트
      setTimeout(() => {
        window.open(naverMapWebUrl, '_blank');
      }, 2000);
    } else {
      // 데스크톱에서는 바로 웹으로
      window.open(naverMapWebUrl, '_blank');
    }
    
    toast.success('네이버 지도로 이동합니다');
  };

  const handleShare = () => {
    if (!facility) return;
    const shareData = {
      title: facility.name,
      text: `${facility.building} ${facility.floor} - ${facility.description || ''}`,
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // 클립보드에 복사
      const shareText = `${facility.name}\n${facility.building} ${facility.floor}\n${facility.hours}`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('정보가 클립보드에 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCall = () => {
    if (facility && facility.contact) {
      window.location.href = `tel:${facility.contact}`;
    }
  };

  const handleDownload = async () => {
    if (!facility?.image) return;
    
    try {
      const response = await fetch(facility.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${facility.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('이미지가 다운로드되었습니다');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('이미지 다운로드에 실패했습니다');
    }
  };

  const operatingStatus = facility ? isOpen() : false;

  // 그룹화된 시설 렌더링
  if (groupedFacility) {
    const allFacilities = groupedFacility.floors.flatMap(floor => floor.facilities);
    const firstFacility = allFacilities[0];

    const handleGetDirections = () => {
      const { latitude, longitude, building } = groupedFacility;
      const naverMapWebUrl = `https://map.naver.com/v5/search/${encodeURIComponent(building)}?c=${longitude},${latitude},16,0,0,0,dh`;
      window.open(naverMapWebUrl, '_blank');
      toast.success('네이버 지도로 이동합니다');
    };

    const handleShare = () => {
      const shareText = `${groupedFacility.building}\\n${categoryLabels[groupedFacility.category]}\\n층별 시설: ${groupedFacility.floors.length}개 층`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success('정보가 클립보드에 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleFavoriteAll = () => {
      allFacilities.forEach(fac => {
        onToggleFavorite(fac.id);
      });
    };

    return (
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl border-0">
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>{groupedFacility.building}</SheetTitle>
              <SheetDescription>
                {groupedFacility.building} - {categoryLabels[groupedFacility.category]}
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
          <div className="h-full flex flex-col">
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-[#005BAC]/5 to-gray-50">
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-16 h-16 text-[#005BAC]/20" strokeWidth={1.5} />
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-5 right-5 flex gap-2">
                <button
                  onClick={handleToggleFavoriteAll}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                >
                  <Heart 
                    className={`w-5 h-5 ${groupedFacility.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    strokeWidth={2} 
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                  ) : (
                    <Share2 className="w-5 h-5 text-gray-600" strokeWidth={2} />
                  )}
                </button>
              </div>

              {/* Building Badge */}
              <div className="absolute bottom-5 left-5">
                <Badge className="bg-[#005BAC]/90 text-white backdrop-blur-sm border-0 px-3 py-1.5">
                  {groupedFacility.floors.length}개 층
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-white">
              <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-gray-900">{groupedFacility.building}</h2>
                    <Badge variant="secondary" className="bg-[#005BAC]/10 text-[#005BAC] hover:bg-[#005BAC]/10 px-3 py-1 flex-shrink-0">
                      {categoryLabels[groupedFacility.category]}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {groupedFacility.floors.length}개 층에 걸쳐 {allFacilities.length}개의 시설이 있습니다
                  </p>
                </div>

                <Separator />

                {/* Floor-by-Floor Information */}
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-500 mb-4">층별 시설 정보</h3>
                  {groupedFacility.floors.map((floorInfo) => (
                    <Collapsible
                      key={floorInfo.floor}
                      open={openFloors.includes(floorInfo.floor)}
                      onOpenChange={() => toggleFloor(floorInfo.floor)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-[#005BAC]" strokeWidth={2} />
                            </div>
                            <div className="text-left">
                              <p className="text-gray-900">{floorInfo.floor}</p>
                              <p className="text-xs text-gray-500">{floorInfo.facilities.length}개 시설</p>
                            </div>
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              openFloors.includes(floorInfo.floor) ? 'rotate-180' : ''
                            }`}
                            strokeWidth={2}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 space-y-3 px-4 py-3">
                          {floorInfo.facilities.map((fac) => (
                            <div 
                              key={fac.id} 
                              className="p-4 bg-white border border-gray-100 rounded-lg space-y-3 hover:border-[#005BAC]/30 hover:shadow-md transition-all cursor-pointer group"
                              onClick={() => onFacilityClick && onFacilityClick(fac)}
                            >
                              <div className="flex gap-3">
                                {fac.image && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                    <ImageWithFallback 
                                      src={fac.image} 
                                      alt={fac.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-gray-900 group-hover:text-[#005BAC] transition-colors">{fac.name}</h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(fac.id);
                                      }}
                                      className="flex-shrink-0 p-1 hover:bg-gray-50 rounded transition-colors"
                                    >
                                      <Heart 
                                        className={`w-4 h-4 ${fac.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                        strokeWidth={2}
                                      />
                                    </button>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                      <span className="text-gray-600">{fac.hours}</span>
                                    </div>
                                {fac.contact && (
                                  <div className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                    <span className="text-gray-600">{fac.contact}</span>
                                  </div>
                                )}
                                {fac.description && (
                                  <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                    <span className="text-gray-600 line-clamp-2">{fac.description}</span>
                                  </div>
                                )}
                                </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-5 bg-white border-t border-gray-100 space-y-3">
              <Button
                onClick={handleGetDirections}
                className="w-full h-12 bg-[#005BAC] hover:bg-[#004a8f] text-white rounded-xl"
              >
                <Navigation className="w-5 h-5 mr-2" strokeWidth={2} />
                길찾기
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // 단일 시설 렌더링
  if (!facility) return null;

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-3xl border-0">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>{facility.name}</SheetTitle>
            <SheetDescription>
              {facility.building} {facility.floor} - {categoryLabels[facility.category]}
            </SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <div className="h-full flex flex-col">
          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-[#005BAC]/5 to-gray-50">
            {facility.image ? (
              <ImageWithFallback
                src={facility.image}
                alt={facility.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="w-16 h-16 text-[#005BAC]/20" strokeWidth={1.5} />
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-5 right-5 flex gap-2">
              {facility.image && (
                <button
                  onClick={handleDownload}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                >
                  <Download className="w-5 h-5 text-gray-600" strokeWidth={2} />
                </button>
              )}
              <button
                onClick={() => onToggleFavorite(facility.id)}
                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
              >
                <Heart 
                  className={`w-5 h-5 ${facility.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  strokeWidth={2} 
                />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                ) : (
                  <Share2 className="w-5 h-5 text-gray-600" strokeWidth={2} />
                )}
              </button>
            </div>

            {/* Operating Status Badge */}
            <div className="absolute bottom-5 left-5">
              <Badge 
                className={`${
                  operatingStatus 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-gray-800/70 text-white'
                } backdrop-blur-sm border-0 px-3 py-1.5`}
              >
                {operatingStatus ? '운영 중' : '운영 종료'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="px-6 py-6 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-gray-900">{facility.name}</h2>
                  <Badge variant="secondary" className="bg-[#005BAC]/10 text-[#005BAC] hover:bg-[#005BAC]/10 px-3 py-1 flex-shrink-0">
                    {categoryLabels[facility.category]}
                  </Badge>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" strokeWidth={2} />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" strokeWidth={2} />
                    <span className="text-sm text-gray-600">보통</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Info */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5 text-gray-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-xs text-gray-500 mb-2">위치</p>
                    <p className="text-gray-900">{facility.building} {facility.floor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-gray-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-xs text-gray-500 mb-2">운영시간</p>
                    <p className="text-gray-900">{facility.hours}</p>
                  </div>
                </div>

                {facility.contact && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-xs text-gray-500 mb-2">연락처</p>
                      <button 
                        onClick={handleCall}
                        className="text-gray-900 hover:text-[#005BAC] transition-colors flex items-center gap-1.5"
                      >
                        {facility.contact}
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                )}

                {facility.description && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Info className="w-5 h-5 text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-xs text-gray-500 mb-2">상세정보</p>
                      <p className="text-gray-900 leading-relaxed">{facility.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="px-6 py-5 bg-white border-t border-gray-100 space-y-3">
            <Button
              onClick={handleGetDirections}
              className="w-full h-12 bg-[#005BAC] hover:bg-[#004a8f] text-white rounded-xl"
            >
              <Navigation className="w-5 h-5 mr-2" strokeWidth={2} />
              길찾기
            </Button>
            
            {facility.contact && (
              <Button
                onClick={handleCall}
                variant="outline"
                className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2" strokeWidth={2} />
                전화하기
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
