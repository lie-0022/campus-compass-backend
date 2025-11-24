package com.example.campuscompassbackend.user.repository;

import com.example.campuscompassbackend.user.domain.RefreshToken;
import com.example.campuscompassbackend.user.domain.User; // User 임포트
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    // == 이 메소드 추가 ==
    Optional<RefreshToken> findByUser(User user);
}