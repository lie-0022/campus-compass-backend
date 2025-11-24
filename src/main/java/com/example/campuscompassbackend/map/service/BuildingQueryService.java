package com.example.campuscompassbackend.map.service;

import com.example.campuscompassbackend.map.dto.BuildingDetailResponse;
import com.example.campuscompassbackend.map.dto.BuildingResponse;
import com.example.campuscompassbackend.map.dto.FloorResponse;
import com.example.campuscompassbackend.map.dto.RoomResponse;
import com.example.campuscompassbackend.map.repository.BuildingRepository;
import com.example.campuscompassbackend.map.repository.FloorRepository;
import com.example.campuscompassbackend.map.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BuildingQueryService {

    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    /** /api/buildings */
    public List<BuildingResponse> listBuildings() {
        return buildingRepository.findAllForList();
    }

    /** /api/buildings/{id} */
    public BuildingDetailResponse getBuilding(Integer buildingId) {
        var header = buildingRepository.findHeader(buildingId)
                .orElseThrow(() -> new NoSuchElementException("건물을 찾을 수 없습니다: " + buildingId));

        var floors = floorRepository.findFloorsOfBuilding(buildingId);
        if (floors.isEmpty()) return header.withFloors(List.of());

        var floorIds = floors.stream().map(FloorResponse::floorId).toList();
        var rooms = roomRepository.findRoomsInFloors(floorIds);

        var roomsByFloor = rooms.stream()
                .collect(Collectors.groupingBy(RoomResponse::floorId));

        var floorsWithRooms = floors.stream()
                .map(f -> f.withRooms(roomsByFloor.getOrDefault(f.floorId(), List.of())))
                .toList();

        return header.withFloors(floorsWithRooms);
    }
}