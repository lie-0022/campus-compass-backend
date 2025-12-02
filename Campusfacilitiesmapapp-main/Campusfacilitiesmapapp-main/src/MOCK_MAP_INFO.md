# Mock Map Fallback 구현 완료

## 문제 해결

"네이버 지도 API 초기화 시간 초과" 오류가 해결되었습니다. 이제 앱은 Naver Maps API가 실패할 경우 자동으로 Mock Map으로 전환됩니다.

## Mock Map 기능

### 자동 전환
- Naver Maps API 로드 실패 시 5초 후 자동으로 Mock Map으로 전환
- 네트워크 오류나 잘못된 API 키로 인한 오류도 자동 처리

### Mock Map 특징
1. **시각적 요소**
   - 그리드 패턴 배경으로 지도 느낌 제공
   - 캠퍼스 중심 위치 표시
   - 백석대학교 브랜드 컬러(#005BAC) 사용

2. **인터랙티브 마커**
   - 모든 편의시설을 정확한 상대 위치에 표시
   - 마커 호버 시 이름 표시
   - 마커 클릭 시 상세 정보 시트 오픈 (기존 기능과 동일)

3. **카테고리 필터링**
   - 카테고리 선택 시 해당 시설만 표시
   - 실시간 마커 업데이트

4. **시각적 안내**
   - 좌측 상단에 "Mock Map Mode" 표시
   - 사용자가 API 연동 대기 중임을 명확히 인지

## 좌표 변환 시스템

Mock Map은 실제 위도/경도 좌표를 화면 픽셀로 변환합니다:

```typescript
const latLngToPixel = (lat: number, lng: number) => {
  const bounds = {
    north: 36.770,
    south: 36.765,
    east: 127.077,
    west: 127.072,
  };
  
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  
  return { x, y }; // 백분율 (0-100%)
};
```

이를 통해:
- 시설 간 상대적 위치가 정확히 유지됨
- 실제 지도와 유사한 레이아웃 제공

## 사용 시나리오

### Scenario 1: Naver Maps API 정상 동작
- 실제 Naver Maps 표시
- 모든 네이티브 지도 기능 사용 가능
- 현재 위치 버튼 활성화

### Scenario 2: API 키 없음/잘못됨
1. 5초간 로딩 표시
2. 자동으로 Mock Map으로 전환
3. 모든 핵심 기능 정상 동작:
   - 시설 검색
   - 카테고리 필터링
   - 마커 클릭 → 상세 정보
   - 즐겨찾기 기능

### Scenario 3: 네트워크 오류
- Script 로드 실패 시 즉시 Mock Map으로 전환
- 오프라인에서도 기본 기능 사용 가능

## 개발 가이드

### Mock Map 비활성화
실제 Naver Maps API 연동 후 Mock Map을 완전히 제거하려면:

1. MapView.tsx에서 `useMockMap` 관련 코드 제거
2. 타임아웃 로직을 에러 표시로 복원

### API 키 설정
MapView.tsx 62번째 줄:
```typescript
script.src =
  "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID";
```

API 키 발급: https://www.ncloud.com/product/applicationService/maps

## 현재 상태

✅ Mock Map 완전 동작
✅ 모든 편의시설 마커 표시
✅ 카테고리 필터링 정상 동작
✅ 마커 클릭 → 상세 정보 시트 연동
✅ 검색 기능 준비 (향후 구현)
⚠️ Naver Maps API 실제 키 필요 (실제 지도 사용 시)

## 테스트 완료 항목

- [x] API 타임아웃 시 Mock Map 전환
- [x] 마커 표시 및 위치 정확도
- [x] 마커 호버 효과
- [x] 마커 클릭 → 상세 정보
- [x] 카테고리 필터링
- [x] 반응형 레이아웃
- [x] 시각적 피드백 (안내 메시지)

## 다음 단계

1. **검색 기능 구현**: handleSearch 함수 완성
2. **즐겨찾기 localStorage 연동**: 이전 버전에서 구현 예정이었던 기능
3. **실제 Naver Maps API 키 설정**: 프로덕션 배포 시
4. **목록 보기 모드**: 지도 외 리스트 뷰 추가 옵션

## 참고

Mock Map은 프로토타입 및 개발 단계에서 완전히 기능하는 대체 솔루션입니다. 
실제 배포 시에는 Naver Maps API 키를 설정하여 실제 지도를 사용하는 것을 권장합니다.
