package com.campuscompass.backend.map.repository;

import com.campuscompass.backend.map.domain.Building;
import com.campuscompass.backend.map.dto.BuildingDetailResponse;
import com.campuscompass.backend.map.dto.BuildingResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BuildingRepository extends JpaRepository<Building, Integer> {
    @Query("""
        select new com.campuscompass.backend.map.dto.BuildingResponse(
            b.id, b.name, b.latitude, b.longitude
        )
        from Building b
        order by lower(b.name) asc
    """)
    List<BuildingResponse> findAllForList();

    @Query("""
        select new com.campuscompass.backend.map.dto.BuildingDetailResponse(
            b.id, b.name, b.latitude, b.longitude, b.description
        )
        from Building b
        where b.id = :buildingId
    """)
    Optional<BuildingDetailResponse> findHeader(Integer buildingId);
}