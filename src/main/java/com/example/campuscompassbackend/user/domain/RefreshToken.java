package com.example.campuscompassbackend.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // == 생성자 추가 ==
    public RefreshToken(User user, String token, long validityInSeconds) {
        this.user = user;
        this.token = token;
        this.expiresAt = LocalDateTime.now().plusSeconds(validityInSeconds);
    }

    // == (선택적) 토큰 값 업데이트 메소드 ==
    public void updateToken(String token, long validityInSeconds) {
        this.token = token;
        this.expiresAt = LocalDateTime.now().plusSeconds(validityInSeconds);
    }
}