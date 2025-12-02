package com.example.campusapp;

import org.springframework.boot.SpringApplication; // 이 라인이 추가되어야 합니다.
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusAppApplication {

    public static void main(String[] args) {
        // 서버를 시작하는 핵심 메서드를 호출합니다.
        // 이 코드가 없으면 서버가 시작되지 않고 바로 종료됩니다.
        SpringApplication.run(CampusAppApplication.class, args);
    }
}