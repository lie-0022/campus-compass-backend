import { useState, useEffect, useRef } from "react";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { MapPin, Crosshair, Home } from "lucide-react";
import { Facility, GroupedFacility } from "../App";
import { useNavigate } from "react-router-dom";

// 네이버 지도 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

interface MapViewProps {
  facilities: Facility[];
  onGroupedFacilityClick: (groupedFacility: GroupedFacility) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// 건물별로 시설 그룹화 함수
function groupFacilitiesByBuilding(facilities: Facility[]): GroupedFacility[] {
  const grouped = new Map<string, GroupedFacility>();

  facilities.forEach(facility => {
    // 건물 이름만으로 그룹화 (카테고리 구분 없이)
    const key = facility.building;
    
    if (!grouped.has(key)) {
      // 첫 번째 시설의 정보로 그룹 초기화
      grouped.set(key, {
        building: facility.building,
        category: facility.category, // 대표 카테고리는 첫 시설의 카테고리 사용
        latitude: facility.latitude,
        longitude: facility.longitude,
        floors: [],
        isFavorite: facility.isFavorite || false,
      });
    }

    const group = grouped.get(key)!;
    
    // 해당 층 정보가 이미 있는지 확인
    let floorInfo = group.floors.find(f => f.floor === facility.floor);
    
    if (!floorInfo) {
      floorInfo = {
        floor: facility.floor,
        facilities: [],
      };
      group.floors.push(floorInfo);
    }
    
    floorInfo.facilities.push(facility);
    
    // 그룹 내 시설 중 하나라도 즐겨찾기면 그룹도 즐겨찾기 표시
    if (facility.isFavorite) {
      group.isFavorite = true;
    }
  });

  // 층별로 정렬
  Array.from(grouped.values()).forEach(group => {
    group.floors.sort((a, b) => {
      // 층 숫자 추출 (예: "3층" -> 3, "지하 1층" -> -1)
      const getFloorNumber = (floor: string): number => {
        if (floor.includes('지하')) {
          const match = floor.match(/(\d+)/);
          return match ? -parseInt(match[1]) : -999;
        }
        const match = floor.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      return getFloorNumber(a.floor) - getFloorNumber(b.floor);
    });
  });

  return Array.from(grouped.values());
}

// 백석대학교 중심 좌표
const BAEKSEOK_CENTER = {
  lat: 36.7675,
  lng: 127.0745,
};

export function MapView({
  facilities,
  onGroupedFacilityClick,
  selectedCategory,
  onCategoryChange,
}: MapViewProps) {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [useMockMap, setUseMockMap] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: 검색 기능 구현
  };

  const filteredFacilities =
    selectedCategory === "all"
      ? facilities
      : facilities.filter(
          (f) => f.category === selectedCategory,
        );

  // 필터링된 시설을 건물별로 그룹화
  const groupedFacilities = groupFacilitiesByBuilding(filteredFacilities);

  // 목 맵을 위한 좌표 변환 함수 (위도/경도 -> 픽셀)
  const latLngToPixel = (lat: number, lng: number) => {
    // 백석대학교 캠퍼스 경계 설정
    const bounds = {
      north: 36.770,
      south: 36.765,
      east: 127.077,
      west: 127.072,
    };
    
    // 좌표를 0-100% 범위로 변환
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // 네이버 지도 API 스크립트 로드
  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    // 실제 사용 시 본인의 네이버 지도 API 클라이언트 ID로 교체해야 합니다
    script.src =
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=bcvt9fiqyc";
    script.async = true;
    script.onload = () => {
      // API 스크립트는 로드되었지만 window.naver가 준비될 때까지 대기
      const checkNaver = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkNaver);
          setMapLoaded(true);
        }
      }, 100);

      // 5초 후에도 로드되지 않으면 목 맵 사용
      setTimeout(() => {
        clearInterval(checkNaver);
        if (!window.naver || !window.naver.maps) {
          setUseMockMap(true);
          setMapLoaded(true); // 목 맵을 로드된 것으로 처리
        }
      }, 5000);
    };
    script.onerror = () => {
      setUseMockMap(true);
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // cleanup은 필요시에만
    };
  }, []);

  // 네이버 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.naver || useMockMap) return;

    try {
      // 지도 초기화
      const mapOptions = {
        center: new window.naver.maps.LatLng(
          BAEKSEOK_CENTER.lat,
          BAEKSEOK_CENTER.lng,
        ),
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: false,
      };

      naverMapRef.current = new window.naver.maps.Map(
        mapRef.current,
        mapOptions,
      );
    } catch (error) {
      console.error("네이버 지도 초기화 실패:", error);
      setUseMockMap(true);
    }
  }, [mapLoaded, useMockMap]);

  // 마커 업데이트 (그룹화된 시설)
  useEffect(() => {
    if (
      !naverMapRef.current ||
      !window.naver ||
      !window.naver.maps ||
      useMockMap
    )
      return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 그룹화된 시설에 마커 추가
    groupedFacilities.forEach((groupedFacility) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          groupedFacility.latitude,
          groupedFacility.longitude,
        ),
        map: naverMapRef.current,
        title: groupedFacility.building,
        icon: {
          content: `
            <div style="
              width: 36px;
              height: 36px;
              background-color: #005BAC;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `,
          anchor: new window.naver.maps.Point(18, 36),
        },
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(
        marker,
        "click",
        () => {
          onGroupedFacilityClick(groupedFacility);
        },
      );

      markersRef.current.push(marker);
    });
  }, [groupedFacilities, onGroupedFacilityClick, useMockMap]);

  // 현재 위치로 이동
  const handleCurrentLocation = () => {
    if (useMockMap) {
      console.log("목 맵에서는 현재 위치 기능을 사용할 수 없습니다");
      return;
    }
    
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않았습니다.");
      return;
    }

    if (navigator.geolocation && naverMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!window.naver || !window.naver.maps) return;

          const { latitude, longitude } = position.coords;
          const location = new window.naver.maps.LatLng(
            latitude,
            longitude,
          );
          naverMapRef.current.setCenter(location);
          naverMapRef.current.setZoom(17);
        },
        (error) => {
          console.error(
            "현재 위치를 가져올 수 없습니다:",
            error,
          );
          // 권한이 없으면 백석대학교 중심으로
          if (
            naverMapRef.current &&
            window.naver &&
            window.naver.maps
          ) {
            naverMapRef.current.setCenter(
              new window.naver.maps.LatLng(
                BAEKSEOK_CENTER.lat,
                BAEKSEOK_CENTER.lng,
              ),
            );
          }
        },
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-white px-5 pt-4 pb-5 space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#005BAC] text-lg tracking-tight">
              Campus Compass
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#005BAC]/10 transition-colors group"
            title="메인 화면으로"
          >
            <Home className="w-5 h-5 text-[#005BAC] group-hover:scale-110 transition-transform" strokeWidth={2} />
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Category Filter */}
        <div className="-mx-5">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 px-5 pt-4 pb-6">
        <div className="relative h-full bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 네이버 지도 컨테이너 */}
          {!useMockMap && <div ref={mapRef} className="absolute inset-0" />}
          
          {/* 목 맵 (API 실패 시 대체) */}
          {useMockMap && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
              {/* 그리드 패턴 */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #005BAC 1px, transparent 1px),
                    linear-gradient(to bottom, #005BAC 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
              
              {/* 캠퍼스 중심 표시 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                  <div className="text-xs text-gray-400 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                    백석대학교 캠퍼스
                  </div>
                </div>
              </div>
              
              {/* 목 맵 마커들 (그룹화) */}
              {groupedFacilities.map((groupedFacility, index) => {
                const pos = latLngToPixel(groupedFacility.latitude, groupedFacility.longitude);
                return (
                  <button
                    key={`${groupedFacility.building}-${groupedFacility.category}-${index}`}
                    onClick={() => onGroupedFacilityClick(groupedFacility)}
                    className="absolute group cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                    title={groupedFacility.building}
                  >
                    <div className="relative">
                      {/* 마커 핀 */}
                      <div className="w-8 h-8 bg-[#005BAC] rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all group-hover:shadow-xl">
                        <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      
                      {/* 마커 레이블 */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs">
                          {groupedFacility.building}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {/* 목 맵 안내 */}
              <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 shadow-sm">
                <p className="text-xs text-yellow-800">
                  ⚠️ Mock Map Mode (API 연동 대기중)
                </p>
              </div>
            </div>
          )}

          {/* 로딩 표시 */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center space-y-3 p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#005BAC]/5 flex items-center justify-center">
                  <MapPin
                    className="w-8 h-8 text-[#005BAC]/40 animate-pulse"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">
                    지도를 불러오는 중...
                  </h3>
                  <p className="text-xs text-gray-400">
                    잠시만 기다려주세요
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 에러 표시 */}
          {mapError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center space-y-3 p-8 max-w-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                  <MapPin
                    className="w-8 h-8 text-red-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="text-sm text-gray-700 mb-2">
                    네이버 지도 API 연동 필요
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    MapView.tsx 파일에서
                    <br />
                    네이버 지도 API 클라이언트 ID를
                    <br />
                    설정해주세요
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    자세한 내용은 NAVER_MAP_SETUP.md를
                    참고하세요
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Location Button */}
          {mapLoaded && !useMockMap && (
            <button
              onClick={handleCurrentLocation}
              className="absolute bottom-5 right-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow active:scale-95 border border-gray-100 z-10"
            >
              <Crosshair
                className="w-5 h-5 text-[#005BAC]"
                strokeWidth={2}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}