package com.example.campuscompassbackend.favorite.repository;

import com.example.campuscompassbackend.favorite.domain.Favorite;
import com.example.campuscompassbackend.map.domain.Room;
import com.example.campuscompassbackend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * 특정 사용자가 즐겨찾기 한 모든 항목을 찾는 메소드
     */
    List<Favorite> findAllByUser(User user);

    /**
     * 특정 사용자와 특정 강의실로 즐겨찾기 항목을 찾는 메소드 (중복 추가 방지용)
     */
    Optional<Favorite> findByUserAndRoom(User user, Room room);
}