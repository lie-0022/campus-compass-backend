package com.example.campuscompassbackend.favorite.service;

import com.example.campuscompassbackend.favorite.domain.Favorite;
import com.example.campuscompassbackend.favorite.dto.FavoriteAddRequest;
import com.example.campuscompassbackend.favorite.dto.FavoriteResponse;
import com.example.campuscompassbackend.favorite.repository.FavoriteRepository;
import com.example.campuscompassbackend.map.domain.Room;
import com.example.campuscompassbackend.map.repository.RoomRepository;
import com.example.campuscompassbackend.user.domain.User;
import com.example.campuscompassbackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    /**
     * 즐겨찾기 추가 로직
     */
    @Transactional
    public Long addFavorite(FavoriteAddRequest request) {
        // ... (이전과 동일) ...
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentId = authentication.getName();
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("강의실을 찾을 수 없습니다."));
        favoriteRepository.findByUserAndRoom(user, room)
                .ifPresent(favorite -> {
                    throw new IllegalArgumentException("이미 즐겨찾기에 추가된 항목입니다.");
                });
        Favorite newFavorite = new Favorite(user, room);
        Favorite savedFavorite = favoriteRepository.save(newFavorite);
        return savedFavorite.getId();
    }

    /**
     * 즐겨찾기 목록 조회 로직
     */
    public List<FavoriteResponse> getFavorites() {
        // ... (이전과 동일) ...
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentId = authentication.getName();
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        List<Favorite> favorites = favoriteRepository.findAllByUser(user);
        return favorites.stream()
                .map(FavoriteResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * 즐겨찾기 삭제 로직 (Room ID 기반)
     */
    @Transactional
    public void deleteFavoriteByRoomId(Integer roomId) {
        // 1. 현재 인증된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String studentId = authentication.getName();
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 삭제할 강의실 정보 가져오기
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("강의실을 찾을 수 없습니다."));

        // 3. '사용자'와 '강의실'을 기준으로 즐겨찾기 항목을 DB에서 조회
        Favorite favorite = favoriteRepository.findByUserAndRoom(user, room)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기 목록에 없는 항목입니다."));

        // 4. 즐겨찾기 항목 삭제
        favoriteRepository.delete(favorite);
    }
}