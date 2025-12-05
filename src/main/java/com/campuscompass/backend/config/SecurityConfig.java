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
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

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
                        .requestMatchers("/", "/login", "/signup", "/map").permitAll()

                        // detail 페이지 100% 허용 (3가지 다 허용)
                        .requestMatchers("/detail", "/detail/", "/detail.html").permitAll()

                        // H2 콘솔
                        .requestMatchers("/h2-console/**").permitAll()

                        // API
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/signup",
                                "/api/user/refresh",
                                "/api/auth/**",
                                "/api/buildings/**",
                                "/api/floors/**",
                                "/api/search"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }
}
