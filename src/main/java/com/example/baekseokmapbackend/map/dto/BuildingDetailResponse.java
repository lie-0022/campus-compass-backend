package com.example.baekseokmapbackend.map.dto;

import java.util.List;

public record BuildingDetailResponse(
        Integer buildingId,
        String name,
        Double latitude,
        Double longitude,
        String description,
        List<FloorResponse> floors
) {
    public BuildingDetailResponse(Integer buildingId, String name, Double latitude, Double longitude, String description) {
        this(buildingId, name, latitude, longitude, description, List.of());
    }

    public BuildingDetailResponse withFloors(List<FloorResponse> floors) {
        return new BuildingDetailResponse(buildingId, name, latitude, longitude, description, floors);
    }
}