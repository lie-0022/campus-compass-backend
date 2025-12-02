package com.example.campusapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CampusController {

    // 브라우저에서 http://localhost:8080/ 주소로 접속하면 이 메서드가 실행됩니다.
    @GetMapping("/")
    public String map() {
        // "map" 이라는 이름의 HTML 파일(map.html)을 찾아서 브라우저에 전송하라는 뜻입니다.
        return "map";
    }
}