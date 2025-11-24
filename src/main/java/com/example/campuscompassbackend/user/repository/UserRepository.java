package com.example.campuscompassbackend.user.repository;

import com.example.campuscompassbackend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * User 엔티티를 위한 리포지토리
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // JpaRepository<User, Long>를 상속받으면
    // save(), findById(), delete() 등의 기본 CRUD 메소드가 자동 생성됩니다.
    // <User, Long>의 의미: 'User' 엔티티를 다루며, PK의 타입은 'Long'이다.

    // === 우리가 추가로 정의해야 하는 메소드 ===

    /**
     * 학번(student_id)으로 사용자를 찾는 메소드 (로그인 시 사용)
     * Spring Data JPA가 메소드 이름을 분석해서 자동으로 SQL을 만들어줍니다.
     */
    Optional<User> findByStudentId(String studentId);
}