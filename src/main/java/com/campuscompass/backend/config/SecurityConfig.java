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
                // 1. CSRF 비활성화
                .csrf(AbstractHttpConfigurer::disable)

                // 2. 세션 미사용 (JWT 기반)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 3. 기본 로그인 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                // 4. URL 접근 권한 설정
                .authorizeHttpRequests(authz -> authz

                        // 정적 리소스 허용
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/assets/**",
                                "/webjars/**",
                                "/favicon.ico"
                        ).permitAll()

                        // 화면 페이지 전체 허용
                        .requestMatchers("/", "/login", "/signup", "/map", "/detail").permitAll()

                        // H2 콘솔 허용
                        .requestMatchers("/h2-console/**").permitAll()

                        // API 허용 (회원가입/로그인/빅데이터 API)
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/signup",
                                "/api/user/refresh",
                                "/api/auth/**",
                                "/api/buildings/**",
                                "/api/floors/**",
                                "/api/search"
                        ).permitAll()

                        // 나머지 호출은 인증 필요
                        .anyRequest().authenticated()
                )

                // 5. H2 콘솔 Iframe 허용
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 6. JWT 필터 적용
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }
}
