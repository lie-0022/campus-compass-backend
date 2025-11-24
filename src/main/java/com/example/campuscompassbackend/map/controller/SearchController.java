package com.example.campuscompassbackend.map.controller;

import com.example.campuscompassbackend.map.service.SearchQueryService;
import com.example.campuscompassbackend.map.dto.SearchResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchQueryService searchQueryService;

    /** GET /api/search?query=... : 통합 검색(건물/강의실/편의시설) */
    @GetMapping("/search")
    public List<SearchResultResponse> search(@RequestParam String query) {
        return searchQueryService.search(query);
    }
}