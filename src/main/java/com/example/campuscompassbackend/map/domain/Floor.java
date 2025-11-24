package com.example.campuscompassbackend.map.domain; // <-- map.domain 패키지 확인

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "floors")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "floor_id")
    private Integer id;

    @Column(nullable = false)
    private Integer level; // 층수 (예: 1, -1)

    private String name; // 층 이름 (예: "로비")

    // Floor가 Building에 속함 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "building_id") // DB의 'building_id' 컬럼과 매핑
    private Building building;

    // Floor가 Room을 리스트로 가지고 있음 (1:N 관계)
    @OneToMany(mappedBy = "floor")
    private List<Room> rooms = new ArrayList<>();
}