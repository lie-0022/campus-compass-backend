package com.example.baekseokmapbackend.map.repository;

import com.example.baekseokmapbackend.map.domain.Building;
import com.example.baekseokmapbackend.map.dto.BuildingDetailResponse;
import com.example.baekseokmapbackend.map.dto.BuildingResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Integer> {
    @Query("""
        select new com.example.baekseokmapbackend.map.dto.BuildingResponse(
            b.id, b.name, b.latitude, b.longitude
        )
        from Building b
        order by lower(b.name) asc
    """)
    List<BuildingResponse> findAllForList();

    @Query("""
        select new com.example.baekseokmapbackend.map.dto.BuildingDetailResponse(
            b.id, b.name, b.latitude, b.longitude, b.description
        )
        from Building b
        where b.id = :buildingId
    """)
    Optional<BuildingDetailResponse> findHeader(Integer buildingId);
}