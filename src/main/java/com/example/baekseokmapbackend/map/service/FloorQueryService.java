package com.example.baekseokmapbackend.map.service;

import com.example.baekseokmapbackend.map.dto.AvailableRoomResponse;
import com.example.baekseokmapbackend.map.repository.FloorRepository;
import com.example.baekseokmapbackend.map.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FloorQueryService {

    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;

    public List<AvailableRoomResponse> getAvailableRooms(Integer floorId,
                                                    Integer dayOfWeek,
                                                    LocalTime start,
                                                    LocalTime end) {
        if (!floorRepository.existsById(floorId)) {
            throw new NoSuchElementException("존재하지 않는 층입니다: " + floorId);
        }

        var now = LocalDateTime.now();
        int dow = (dayOfWeek != null) ? dayOfWeek : now.getDayOfWeek().getValue(); // 1=월
        LocalTime s = (start != null) ? start : now.toLocalTime();
        LocalTime e = (end != null) ? end : s.plusHours(2);
        if (!e.isAfter(s)) throw new IllegalArgumentException("end는 start 이후여야 합니다.");

        return roomRepository.findAvailableClassrooms(floorId, dow, s, e);
    }
}