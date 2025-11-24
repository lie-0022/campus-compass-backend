package com.campuscompass.backend.favorite.dto;

import com.campuscompass.backend.favorite.domain.Favorite;
import com.campuscompass.backend.map.domain.Room;
import lombok.Getter;

@Getter
public class FavoriteResponse {

    private Long favoriteId;
    private Integer roomId;
    private String roomNumber;
    private String roomName;

    // Favorite 엔티티를 FavoriteResponse DTO로 변환하는 생성자
    public FavoriteResponse(Favorite favorite) {
        Room room = favorite.getRoom(); // 즐겨찾기에서 Room 정보 가져오기

        this.favoriteId = favorite.getId();
        this.roomId = room.getId();
        this.roomNumber = room.getRoomNumber();
        this.roomName = room.getName();
    }
}