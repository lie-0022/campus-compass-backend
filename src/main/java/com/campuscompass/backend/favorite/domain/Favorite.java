package com.campuscompass.backend.favorite.domain; // <-- favorite.domain 패키지 확인

import com.campuscompass.backend.map.domain.Room; // map.domain의 Room 임포트
import com.campuscompass.backend.user.domain.User; // user.domain의 User 임포트
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "room_id"}) // 복합 유니크 키
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Favorite이 User에 속함 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Favorite이 Room에 속함 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    // == 생성자 ==
    public Favorite(User user, Room room) {
        this.user = user;
        this.room = room;
        this.createdAt = LocalDateTime.now();
    }
}