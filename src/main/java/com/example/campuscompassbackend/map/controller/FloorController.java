package com.example.campuscompassbackend.map.controller;

import com.example.campuscompassbackend.map.service.FloorQueryService;
import com.example.campuscompassbackend.map.dto.AvailableRoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/floors")
@RequiredArgsConstructor
public class FloorController {

    private final FloorQueryService floorQueryService;

    /**
     * GET /api/floors/{floorId}/available-rooms
     * - 파라미터 미지정 시: 오늘(now) 기준, 지금~2시간
     */
    @GetMapping("/{floorId}/available-rooms")
    public List<AvailableRoomResponse> getAvailableRooms(
            @PathVariable Integer floorId,
            @RequestParam(required = false) Integer dayOfWeek, // 1=월 ... 7=일
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime start,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime end
    ) {
        return floorQueryService.getAvailableRooms(floorId, dayOfWeek, start, end);
    }
}