package com.example.baekseokmapbackend.map.service;

import com.example.baekseokmapbackend.map.dto.SearchResultResponse;
import com.example.baekseokmapbackend.map.repository.SearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SearchQueryService {

    private final SearchRepository searchRepository;

    /** /api/search?query= */
    public List<SearchResultResponse> search(String query) {
        if (query == null || query.isBlank()) return List.of();

        var buildings  = searchRepository.searchBuildings(query);
        var rooms      = searchRepository.searchRooms(query);
        var facilities = searchRepository.searchFacilities(query);

        return Stream.of(buildings, rooms, facilities)
                .flatMap(List::stream)
                .sorted(
                        Comparator.comparing(SearchResultResponse::type)
                                .thenComparing(SearchResultResponse::displayName, String.CASE_INSENSITIVE_ORDER)
                )
                .toList();
    }
}