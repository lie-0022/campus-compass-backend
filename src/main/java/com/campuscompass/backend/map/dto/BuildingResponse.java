package com.campuscompass.backend.map.dto;

public record BuildingResponse(
        Integer buildingId,
        String name,
        Double latitude,
        Double longitude
) { }