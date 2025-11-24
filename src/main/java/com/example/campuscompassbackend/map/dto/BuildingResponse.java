package com.example.campuscompassbackend.map.dto;

public record BuildingResponse(
        Integer buildingId,
        String name,
        Double latitude,
        Double longitude
) { }