package com.example.baekseokmapbackend.map.dto;

public record AvailableRoomResponse(
        Integer roomId,
        String roomNumber,
        String name,
        Integer capacity,
        String features
) { }