package com.campuscompass.backend.map.dto;

public record AvailableRoomResponse(
        Integer roomId,
        String roomNumber,
        String name,
        Integer capacity,
        String features
) { }