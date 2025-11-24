package com.campuscompass.backend.map.repository;

import com.campuscompass.backend.map.dto.SearchResultResponse;

import java.util.List;

public interface SearchRepository {
    List<SearchResultResponse> searchBuildings(String q);
    List<SearchResultResponse> searchRooms(String q);
    List<SearchResultResponse> searchFacilities(String q);
}