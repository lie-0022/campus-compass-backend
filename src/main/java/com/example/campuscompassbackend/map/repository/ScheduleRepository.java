package com.example.campuscompassbackend.map.repository;

import com.example.campuscompassbackend.map.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {


    @Query("SELECT s.room.id FROM Schedule s " +
            "WHERE s.dayOfWeek = :dayOfWeek " +
            "AND s.startTime < :endTime " +
            "AND s.endTime > :startTime")
    List<Integer> findBookedRoomIdsByTime(
            @Param("dayOfWeek") int dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}