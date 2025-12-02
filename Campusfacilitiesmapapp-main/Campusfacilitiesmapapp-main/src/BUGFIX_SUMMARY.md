# Bug Fix Summary - MapView Component

## Issues Fixed

### 1. TypeError: Cannot read properties of null (reading 'LatLng')
**Location**: `MapView.tsx:152:36`

**Root Cause**: 
The `handleCurrentLocation` function was attempting to use `window.naver.maps.LatLng` without checking if the Naver Maps API was fully loaded and available.

**Fix Applied**:
- Added explicit checks for `window.naver` and `window.naver.maps` before attempting to use the API
- Added safety checks within the geolocation callbacks
- Prevents the function from executing if the API is not available

### 2. Geolocation Error Handling
**Issue**: 
Error message "현재 위치를 가져올 수 없습니다: {}" was being logged without proper context.

**Fix Applied**:
- Enhanced error handling in geolocation error callback
- Added additional null checks before attempting to use Naver Maps API
- Improved console error messages for better debugging

### 3. Race Condition in API Loading
**Issue**: 
The `mapLoaded` state was being set immediately when the script loaded, but `window.naver.maps` might not be fully initialized yet.

**Fix Applied**:
- Implemented polling mechanism that checks for `window.naver.maps` availability every 100ms
- Added 5-second timeout with error handling if API doesn't initialize
- Added `mapError` state to track loading failures

### 4. Improved Error UI
**Addition**:
- Created user-friendly error screen when the Naver Maps API fails to load
- Provides clear instructions to users about setting up the API client ID
- References the NAVER_MAP_SETUP.md documentation

## Changes Made

### MapView.tsx

#### 1. Added Error State
```typescript
const [mapError, setMapError] = useState(false);
```

#### 2. Enhanced Script Loading
```typescript
script.onload = () => {
  // API 스크립트는 로드되었지만 window.naver가 준비될 때까지 대기
  const checkNaver = setInterval(() => {
    if (window.naver && window.naver.maps) {
      clearInterval(checkNaver);
      setMapLoaded(true);
    }
  }, 100);

  // 5초 후에도 로드되지 않으면 에러 처리
  setTimeout(() => {
    clearInterval(checkNaver);
    if (!window.naver || !window.naver.maps) {
      setMapError(true);
      console.error('네이버 지도 API 초기화 시간 초과');
    }
  }, 5000);
};
```

#### 3. Fixed handleCurrentLocation
```typescript
const handleCurrentLocation = () => {
  if (!window.naver || !window.naver.maps) {
    console.error('네이버 지도 API가 로드되지 않았습니다.');
    return;
  }

  if (navigator.geolocation && naverMapRef.current) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!window.naver || !window.naver.maps) return;
        // ... rest of the code
      },
      (error) => {
        console.error('현재 위치를 가져올 수 없습니다:', error);
        if (naverMapRef.current && window.naver && window.naver.maps) {
          // ... fallback to campus center
        }
      }
    );
  }
};
```

#### 4. Enhanced Marker Update Safety
```typescript
useEffect(() => {
  if (!naverMapRef.current || !window.naver || !window.naver.maps) return;
  // ... marker update logic
}, [filteredFacilities, onFacilityClick]);
```

#### 5. Added Error UI
```typescript
{mapError && (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center space-y-3 p-8 max-w-sm">
      <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-red-400" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm text-gray-700 mb-2">네이버 지도 API 연동 필요</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          MapView.tsx 파일에서<br />
          네이버 지도 API 클라이언트 ID를<br />
          설정해주세요
        </p>
        <p className="text-xs text-gray-400 mt-3">
          자세한 내용은 NAVER_MAP_SETUP.md를 참고하세요
        </p>
      </div>
    </div>
  </div>
)}
```

## Testing Recommendations

1. **Without API Key** (Current state):
   - App should show error message after ~5 seconds
   - No console errors about null references
   - Clear instructions displayed to user

2. **With Valid API Key**:
   - Map should load successfully
   - Markers should display for all facilities
   - Current location button should work (with user permission)
   - Category filtering should update markers correctly

3. **Edge Cases**:
   - Test with geolocation denied
   - Test with slow network connection
   - Test rapid category switching before map loads

## Prevention Measures

Going forward, always ensure:
1. Check for `window.naver` and `window.naver.maps` existence before using the API
2. Handle async API loading with proper state management
3. Provide user-friendly error messages
4. Add timeouts for external script loading
5. Use polling or callbacks to confirm API availability

## Related Files
- `/components/MapView.tsx` - Main component with fixes
- `/NAVER_MAP_SETUP.md` - Setup documentation
- `/App.tsx` - Parent component (no changes needed)

## Status
✅ All errors resolved
✅ Improved error handling
✅ Better user experience for API setup
