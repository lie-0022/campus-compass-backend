package com.example.baekseokmapbackend.map.repository;

import com.example.baekseokmapbackend.map.dto.SearchResultResponse;

import java.util.List;

public interface SearchRepository {
    List<SearchResultResponse> searchBuildings(String q);
    List<SearchResultResponse> searchRooms(String q);
    List<SearchResultResponse> searchFacilities(String q);
}