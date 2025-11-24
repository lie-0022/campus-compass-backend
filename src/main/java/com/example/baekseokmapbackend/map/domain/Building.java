package com.example.baekseokmapbackend.map.domain; // <-- map.domain 패키지 확인

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buildings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "building_id")
    private Integer id;

    @Column(nullable = false)
    private String name;

    // 위도 (POINT 타입 대신 사용)
    private Double latitude;

    // 경도 (POINT 타입 대신 사용)
    private Double longitude;

    private String description;

    // Building이 Floor를 리스트로 가지고 있음 (1:N 관계)
    // 'mappedBy'는 Floor 엔티티에 있는 'building' 필드 이름을 가리킵니다.
    @OneToMany(mappedBy = "building")
    private List<Floor> floors = new ArrayList<>();
}