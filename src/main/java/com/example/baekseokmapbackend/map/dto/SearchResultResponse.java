package com.example.baekseokmapbackend.map.dto;

public record SearchResultResponse(
        String type,
        Integer id,
        String displayName,
        String subTitle,
        Double latitude,
        Double longitude,
        Integer buildingId,
        Integer floorId
) { }