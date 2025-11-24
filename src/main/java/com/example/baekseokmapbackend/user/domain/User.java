package com.example.baekseokmapbackend.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    // DB 컬럼은 'student_id'로, Java 필드는 'studentId'로 매핑
    @Column(name = "student_id", unique = true, nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    // DB 컬럼은 'created_at'으로, Java 필드는 'createdAt'으로 매핑
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // == 생성자 ==
    public User(String studentId, String password, String nickname) {
        this.studentId = studentId;
        this.password = password;
        this.nickname = nickname;
        this.createdAt = LocalDateTime.now();
    }
}