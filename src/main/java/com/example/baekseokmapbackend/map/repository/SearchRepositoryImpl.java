package com.example.baekseokmapbackend.map.repository;

import com.example.baekseokmapbackend.map.dto.SearchResultResponse;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SearchRepositoryImpl implements SearchRepository {

    private final EntityManager em;

    private static String like(String q) {
        return "%" + q.toLowerCase() + "%";
    }

    @Override
    public List<SearchResultResponse> searchBuildings(String q) {
        return em.createQuery("""
            select new com.example.baekseokmapbackend.map.dto.SearchResultResponse(
                'BUILDING', b.id, b.name, null,
                b.latitude, b.longitude,
                b.id, null
            )
            from Building b
            where lower(b.name) like :q
            order by lower(b.name) asc
        """, SearchResultResponse.class)
                .setParameter("q", like(q))
                .getResultList();
    }

    @Override
    public List<SearchResultResponse> searchRooms(String q) {
        return em.createQuery("""
            select new com.example.baekseokmapbackend.map.dto.SearchResultResponse(
                'ROOM', r.id,
                coalesce(r.roomNumber, r.name),
                r.name,
                r.floor.building.latitude, r.floor.building.longitude,
                r.floor.building.id, r.floor.id
            )
            from Room r
            where (lower(r.name) like :q or lower(coalesce(r.roomNumber, '')) like :q)
              and r.roomType = 'CLASSROOM'
            order by 
              case when r.roomNumber is null then 1 else 0 end,
              r.roomNumber asc, lower(r.name) asc
        """, SearchResultResponse.class)
                .setParameter("q", like(q))
                .getResultList();
    }

    @Override
    public List<SearchResultResponse> searchFacilities(String q) {
        return em.createQuery("""
            select new com.example.baekseokmapbackend.map.dto.SearchResultResponse(
                'FACILITY', r.id,
                r.name,
                null,
                r.floor.building.latitude, r.floor.building.longitude,
                r.floor.building.id, r.floor.id
            )
            from Room r
            where r.roomType = 'FACILITY'
              and (lower(r.name) like :q or lower(coalesce(r.features, '')) like :q)
            order by lower(r.name) asc
        """, SearchResultResponse.class)
                .setParameter("q", like(q))
                .getResultList();
    }
}