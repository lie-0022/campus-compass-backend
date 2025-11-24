package com.example.baekseokmapbackend.map.repository;

import com.example.baekseokmapbackend.map.domain.Room;
import com.example.baekseokmapbackend.map.dto.AvailableRoomResponse;
import com.example.baekseokmapbackend.map.dto.RoomResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("""
        select new com.example.baekseokmapbackend.map.dto.RoomResponse(
            r.id, r.roomNumber, r.name, r.roomType,
            r.capacity, r.features, r.operatingHours, r.floor.id
        )
        from Room r
        where r.floor.id in :floorIds
        order by 
          case when r.roomNumber is null then 1 else 0 end,
          r.roomNumber asc, lower(r.name) asc
    """)
    List<RoomResponse> findRoomsInFloors(Collection<Integer> floorIds);

    /** 특정 층의 '비어있는 강의실' (시간 겹침 없음) */
    @Query("""
        select new com.example.baekseokmapbackend.map.dto.AvailableRoomResponse(
            r.id, r.roomNumber, r.name, r.capacity, r.features
        )
        from Room r
        where r.floor.id = :floorId
          and r.roomType = 'CLASSROOM'
          and not exists (
              select s.id from Schedule s
              where s.room = r
                and s.dayOfWeek = :dayOfWeek
                and s.startTime < :endTime
                and s.endTime > :startTime
          )
        order by 
          case when r.roomNumber is null then 1 else 0 end,
          r.roomNumber asc, lower(r.name) asc
    """)
    List<AvailableRoomResponse> findAvailableClassrooms(
            Integer floorId, Integer dayOfWeek, LocalTime startTime, LocalTime endTime
    );

    /**
     * 특정 층(floorId)에 속하고,
     * 이름이나 방 번호에 검색어(query)가 포함된 Room 목록을 찾는 메소드
     */
    @Query("SELECT r FROM Room r WHERE r.floor.id = :floorId AND (r.name LIKE %:query% OR r.roomNumber LIKE %:query%)")
    List<Room> findByFloorIdAndNameOrRoomNumberContaining(@Param("floorId") Integer floorId, @Param("query") String query);

    /**
     * 이름이나 방 번호에 검색어(query)가 포함된 Room 목록을 찾는 메소드 (통합 검색용)
     */
    List<Room> findByNameContainingOrRoomNumberContaining(String name, String roomNumber);
}