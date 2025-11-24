package com.campuscompass.backend.map.controller;

import com.campuscompass.backend.map.service.BuildingQueryService;
import com.campuscompass.backend.map.dto.BuildingDetailResponse;
import com.campuscompass.backend.map.dto.BuildingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingQueryService buildingQueryService;

    /** GET /api/buildings : 전체 건물 목록 */
    @GetMapping
    public List<BuildingResponse> listBuildings() {
        return buildingQueryService.listBuildings();
    }

    /** GET /api/buildings/{buildingId} : 건물 상세(층/방 포함) */
    @GetMapping("/{buildingId}")
    public BuildingDetailResponse getBuilding(@PathVariable Integer buildingId) {
        return buildingQueryService.getBuilding(buildingId);
    }
}