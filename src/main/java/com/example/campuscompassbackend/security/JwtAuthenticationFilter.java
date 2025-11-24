package com.example.campuscompassbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter { // OncePerRequestFilter: 요청마다 한 번만 실행되는 필터

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. 요청(Request) 헤더에서 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰 유효성 검사
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            // 3. 토큰이 유효하면, 토큰에서 인증 정보(Authentication)를 생성
            Authentication authentication = getAuthentication(token);

            // 4. SecurityContextHolder에 인증 정보를 저장
            // (이 작업이 끝나면, Spring Security는 이 요청을 '인증된 사용자'로 인식합니다.)
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // 5. 다음 필터로 요청을 전달 (검문 통과)
        filterChain.doFilter(request, response);
    }

    /**
     * Request Header에서 "Authorization" 키의 값을(토큰을) 꺼내는 메소드
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 7글자를 뺀 토큰 값 반환
        }
        return null;
    }

    /**
     * 토큰에서 인증 정보(Authentication) 객체를 생성하는 메소드
     */
    private Authentication getAuthentication(String token) {
        String studentId = jwtTokenProvider.getStudentIdFromToken(token);
        // (우리는 간단한 앱이라 권한(Role)이 없으므로 "ROLE_USER"로 고정합니다.)
        return new UsernamePasswordAuthenticationToken(
                studentId, // Principal (사용자 식별자)
                "",        // Credentials (비밀번호, 토큰 방식에선 비워둠)
                Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")) // Authorities (권한 목록)
        );
    }
}