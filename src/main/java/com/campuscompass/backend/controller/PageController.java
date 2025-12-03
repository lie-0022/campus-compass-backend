package com.campuscompass.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // 메인 페이지 (지도 화면)
    @GetMapping("/")
    public String mainPage() {
        return "login";
    }

    // 로그인 페이지 (나중에 사용)
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    @GetMapping("/map")
    public String mapPage() {
        return "index"; // index.html 로 이동
    }

}