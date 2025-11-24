package com.example.campuscompassbackend.map.dto;

import java.util.List;

public record FloorResponse(
        Integer floorId,
        Integer level,
        String name,
        List<RoomResponse> rooms
) {
    public FloorResponse(Integer floorId, Integer level, String name) {
        this(floorId, level, name, List.of());
    }

    public FloorResponse withRooms(List<RoomResponse> rooms) {
        return new FloorResponse(floorId, level, name, rooms);
    }
}