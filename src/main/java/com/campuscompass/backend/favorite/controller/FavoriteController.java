package com.campuscompass.backend.favorite.controller;

import com.campuscompass.backend.favorite.dto.FavoriteAddRequest;
import com.campuscompass.backend.favorite.dto.FavoriteResponse;
import com.campuscompass.backend.favorite.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 즐겨찾기 추가 API
     * (POST /api/favorites)
     */
    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteAddRequest request) {
        // ... (이전과 동일) ...
        favoriteService.addFavorite(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("즐겨찾기에 추가되었습니다.");
    }

    /**
     * 즐겨찾기 목록 조회 API
     * (GET /api/favorites)
     */
    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getFavorites() {
        // ... (이전과 동일) ...
        List<FavoriteResponse> favorites = favoriteService.getFavorites();
        return ResponseEntity.ok(favorites);
    }

    /**
     * 즐겨찾기 삭제 API (Room ID 기반)
     * (DELETE /api/favorites?roomId=1)
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteFavorite(@RequestParam Integer roomId) {
        favoriteService.deleteFavoriteByRoomId(roomId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}