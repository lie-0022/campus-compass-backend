package com.campuscompass.backend.config;

import com.campuscompass.backend.security.JwtAuthenticationFilter;
import com.campuscompass.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // 1. CSRF 비활성화 (H2 및 API 통신 편의성)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. 세션 미사용 (JWT 사용)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3. 폼 로그인 & 기본 인증 비활성화 (우리는 커스텀 로그인 페이지 사용)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                // 4. 요청 권한 설정 (여기가 핵심!)
                .authorizeHttpRequests(authz -> authz
                        // 정적 리소스 (CSS, JS, 이미지) 허용
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()

                        // 화면 페이지 URL 허용
                        .requestMatchers("/", "/login", "/signup", "/map").permitAll()

                        // H2 콘솔 허용
                        .requestMatchers("/h2-console/**").permitAll()

                        // 기존 API 허용 목록
                        .requestMatchers("/api/user/login", "/api/user/signup", "/api/user/refresh").permitAll() // user 경로 확인 필요
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/buildings/**", "/api/floors/**", "/api/search").permitAll()

                        .anyRequest().authenticated()
                )

                // 5. H2 콘솔 깨짐 방지
                .headers(headers ->
                        headers.frameOptions(frame -> frame.disable()))

                // 6. JWT 필터 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}