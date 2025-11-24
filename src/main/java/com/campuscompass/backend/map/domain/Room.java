package com.campuscompass.backend.map.domain; // <-- map.domain 패키지 확인

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer id;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "room_type", nullable = false)
    private String roomType; // "CLASSROOM", "FACILITY"

    private Integer capacity; // 강의실일 경우

    private String features; // 강의실 특징

    @Column(name = "operating_hours")
    private String operatingHours; // 편의시설일 경우

    // Room이 Floor에 속함 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id")
    private Floor floor;
}