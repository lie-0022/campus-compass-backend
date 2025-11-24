package com.example.campuscompassbackend.map.dto;

public record RoomResponse(
        Integer roomId,
        String roomNumber,
        String name,
        String roomType,
        Integer capacity,
        String features,
        String operatingHours,
        Integer floorId
) { }