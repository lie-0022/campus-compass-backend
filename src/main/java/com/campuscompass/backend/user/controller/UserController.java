package com.campuscompass.backend.user.controller;

// LogoutRequest, RefreshRequest, AccessTokenResponse를 임포트합니다.
import com.campuscompass.backend.user.dto.*;
import com.campuscompass.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 회원가입 API
     * (POST /api/auth/signup)
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest request) {
        userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공");
    }

    /**
     * 로그인 API
     * (POST /api/auth/login)
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        TokenResponse token = userService.login(request);
        return ResponseEntity.ok(token); // 200 OK와 함께 토큰 응답
    }

    /**
     * 로그아웃 API
     * (POST /api/auth/logout)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request) {
        userService.logout(request);
        return ResponseEntity.ok("로그아웃 성공");
    }

    /**
     * Access Token 갱신 API
     * (POST /api/auth/refresh)
     */
    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refresh(@RequestBody RefreshRequest request) {
        AccessTokenResponse response = userService.reissueToken(request);
        return ResponseEntity.ok(response);
    }
}