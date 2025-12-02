import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Facility } from '../App';
import { 
  Clock, 
  MapPin, 
  Building2,
  Info,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { Header } from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FacilityDetailPageProps {
  facilities: Facility[];
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

export function FacilityDetailPage({ 
  facilities
}: FacilityDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('details');

  useEffect(() => {
    const foundFacility = facilities.find(f => f.id === Number(id));
    if (foundFacility) {
      setFacility(foundFacility);
      // 현재 시설의 건물을 자동으로 펼치기
      setExpandedBuildings([foundFacility.building]);
    } else {
      navigate('/');
    }
  }, [id, facilities, navigate]);

  if (!facility) return null;

  // 건물별로 시설 그룹화
  const groupedByBuilding = facilities.reduce((acc, fac) => {
    if (!acc[fac.building]) {
      acc[fac.building] = [];
    }
    acc[fac.building].push(fac);
    return acc;
  }, {} as Record<string, Facility[]>);

  // 각 건물 내에서 같은 이름의 시설들을 그룹화
  interface GroupedFacilityItem {
    name: string;
    floors: string[];
    facilityIds: number[];
    firstFacilityId: number;
    isCurrentFacility: boolean;
  }

  const groupedByBuildingAndName: Record<string, GroupedFacilityItem[]> = {};
  
  Object.keys(groupedByBuilding).forEach((building) => {
    const buildingFacilities = groupedByBuilding[building];
    const nameGroups: Record<string, Facility[]> = {};
    
    // 같은 이름끼리 그룹화
    buildingFacilities.forEach((fac) => {
      if (!nameGroups[fac.name]) {
        nameGroups[fac.name] = [];
      }
      nameGroups[fac.name].push(fac);
    });
    
    // GroupedFacilityItem 배열로 변환
    groupedByBuildingAndName[building] = Object.entries(nameGroups).map(([name, facs]) => ({
      name,
      floors: facs.map(f => f.floor),
      facilityIds: facs.map(f => f.id),
      firstFacilityId: facs[0].id,
      isCurrentFacility: facs.some(f => f.id === facility.id),
    }));
  });

  const buildingNames = Object.keys(groupedByBuildingAndName).sort();

  const toggleBuilding = (building: string) => {
    setExpandedBuildings(prev =>
      prev.includes(building)
        ? prev.filter(b => b !== building)
        : [...prev, building]
    );
  };

  const handleFacilityClick = (facilityId: number) => {
    navigate(`/facility/${facilityId}`);
  };

  const handleCall = () => {
    if (facility.contact) {
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

  // 상세정보 컴포넌트
  const FacilityDetailsContent = () => (
    <div className="px-4 md:px-6 py-6 space-y-6">
      {/* Facility Title */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-gray-900">{facility.name}</h2>
          <Badge variant="secondary" className="bg-[#005BAC]/10 text-[#005BAC] hover:bg-[#005BAC]/10 px-3 py-1 flex-shrink-0">
            {categoryLabels[facility.category]}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Image */}
      {facility.image ? (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200 group">
          <ImageWithFallback 
            src={facility.image} 
            alt={facility.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95"
            title="이미지 다운로드"
          >
            <Download className="w-4 h-4 text-gray-700" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-[#005BAC]/5 to-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400">이미지 넣는곳</p>
        </div>
      )}

      {/* Introduction Text Area */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-sm text-gray-500 mb-3">시설 상세정보</p>
        <div className="bg-white rounded-lg p-4 min-h-[120px] border border-gray-200">
          <p className="text-gray-600 text-sm leading-relaxed">
            {facility.description || '이 시설에 대한 상세 정보를 입력할 수 있습니다. 운영 시간, 이용 방법, 특징 등을 자세히 설명해주세요.'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Basic Info */}
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building2 className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div className="flex-1 pt-1.5">
            <p className="text-xs text-gray-500 mb-2">위치</p>
            <p className="text-gray-900">{facility.building} {facility.floor}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div className="flex-1 pt-1.5">
            <p className="text-xs text-gray-500 mb-2">운영시간</p>
            <p className="text-gray-900">{facility.hours}</p>
          </div>
        </div>

        {facility.contact && (
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
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
      </div>
    </div>
  );

  // 건물 목록 컴포넌트
  const BuildingListContent = () => (
    <div className="px-4 md:px-5 py-6 space-y-4">
      <div>
        <h3 className="text-gray-900 mb-1">편의시설 목록</h3>
        <p className="text-xs text-gray-500">건물별 시설을 확인하세요</p>
      </div>

      <div className="space-y-3">

        {buildingNames.map((building) => {
          const isExpanded = expandedBuildings.includes(building);
          const groupedFacilities = groupedByBuildingAndName[building];

          return (
            <div key={building} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Building Header */}
              <button
                onClick={() => toggleBuilding(building)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#005BAC]" />
                  <span className="text-sm text-gray-900">{building}</span>
                  <span className="text-xs text-gray-400">
                    {groupedFacilities.length}개
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={2} />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
                )}
              </button>

              {/* Facility List */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {groupedFacilities.map((group, index) => {
                    const firstFacility = facilities.find(f => f.id === group.firstFacilityId);
                    const hasImage = firstFacility?.image;
                    
                    return (
                      <button
                        key={group.firstFacilityId}
                        onClick={() => handleFacilityClick(group.firstFacilityId)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                          group.isCurrentFacility ? 'bg-[#005BAC]/5' : ''
                        } ${
                          index !== groupedFacilities.length - 1 ? 'border-b border-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          {hasImage ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                              <ImageWithFallback 
                                src={firstFacility.image!} 
                                alt={group.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0 ${
                              group.isCurrentFacility ? 'bg-[#005BAC]' : 'bg-gray-300 group-hover:bg-[#005BAC]'
                            }`} />
                          )}
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className={`text-sm transition-colors ${
                              group.isCurrentFacility ? 'text-[#005BAC]' : 'text-gray-700 group-hover:text-[#005BAC]'
                            }`}>
                              {group.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {group.floors.join(', ')}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-colors flex-shrink-0 ml-2 ${
                          group.isCurrentFacility ? 'text-[#005BAC]' : 'text-gray-300 group-hover:text-[#005BAC]'
                        }`} strokeWidth={2} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFC]">
      {/* Header */}
      <Header showBackButton={true} onBackClick={() => navigate('/map')} />

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 overflow-auto">
        {/* Desktop: Two Column Layout */}
        <div className="hidden md:flex h-full">
          {/* Left Side - Facility Details */}
          <div className="flex-1 overflow-auto bg-white border-r border-gray-100">
            <FacilityDetailsContent />
          </div>

          {/* Right Side - Building List */}
          <div className="w-96 overflow-auto bg-white">
            <BuildingListContent />
          </div>
        </div>

        {/* Mobile: Tabs Layout */}
        <div className="md:hidden h-full bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-gray-200">
              <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#005BAC]">
                상세정보
              </TabsTrigger>
              <TabsTrigger value="list" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#005BAC]">
                전체 목록
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="flex-1 overflow-auto m-0">
              <FacilityDetailsContent />
            </TabsContent>
            
            <TabsContent value="list" className="flex-1 overflow-auto m-0">
              <BuildingListContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}