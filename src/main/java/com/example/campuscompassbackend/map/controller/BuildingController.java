package com.example.campuscompassbackend.map.controller;

import com.example.campuscompassbackend.map.service.BuildingQueryService;
import com.example.campuscompassbackend.map.dto.BuildingDetailResponse;
import com.example.campuscompassbackend.map.dto.BuildingResponse;
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