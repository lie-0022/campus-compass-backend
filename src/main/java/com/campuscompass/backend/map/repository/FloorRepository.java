package com.campuscompass.backend.map.repository;

import com.campuscompass.backend.map.domain.Floor;
import com.campuscompass.backend.map.dto.FloorResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FloorRepository extends JpaRepository<Floor, Integer> {
    @Query("""
        select new com.campuscompass.backend.map.dto.FloorResponse(
            f.id, f.level, f.name
        )
        from Floor f
        where f.building.id = :buildingId
        order by f.level asc
    """)
    List<FloorResponse> findFloorsOfBuilding(Integer buildingId);
}