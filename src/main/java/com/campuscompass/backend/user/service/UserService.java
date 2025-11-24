package com.campuscompass.backend.user.service;

import com.campuscompass.backend.security.JwtTokenProvider;
import com.campuscompass.backend.user.domain.RefreshToken;
import com.campuscompass.backend.user.domain.User;
import com.campuscompass.backend.user.dto.*;
import com.campuscompass.backend.user.repository.RefreshTokenRepository;
import com.campuscompass.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * 회원가입 로직
     */
    @Transactional
    public Long signup(SignUpRequest request) {
        if (userRepository.findByStudentId(request.getStudent_id()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 학번입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(
                request.getStudent_id(),
                encodedPassword,
                request.getNickname()
        );

        User savedUser = userRepository.save(newUser);
        return savedUser.getId();
    }

    /**
     * 로그인 로직
     */
    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 1. 학번으로 유저 찾기
        User user = userRepository.findByStudentId(request.getStudent_id())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 학번입니다."));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user.getStudentId());
        String refreshTokenString = jwtTokenProvider.createRefreshToken();
        long refreshTokenValiditySeconds = jwtTokenProvider.getRefreshTokenValidityInSeconds();

        // 4. Refresh Token을 DB에 저장
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken(
                        user,
                        refreshTokenString,
                        refreshTokenValiditySeconds
                ));

        if (refreshToken.getId() != null) {
            refreshToken.updateToken(
                    refreshTokenString,
                    refreshTokenValiditySeconds
            );
        }

        refreshTokenRepository.save(refreshToken);

        // 5. 토큰 반환
        return new TokenResponse(accessToken, refreshTokenString);
    }

    /**
     * 로그아웃 로직
     */
    @Transactional
    public void logout(LogoutRequest request) {
        // 1. Refresh Token 찾기
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다."));

        // 2. DB에서 해당 토큰 삭제
        refreshTokenRepository.delete(refreshToken);
    }

    /**
     * 토큰 갱신 로직 (Access Token 재발급)
     */
    @Transactional(readOnly = true)
    public AccessTokenResponse reissueToken(RefreshRequest request) {
        // 1. Refresh Token 유효성 검증 (JWT 자체)
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다. (Validation Fail)");
        }

        // 2. Refresh Token DB에서 찾기
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리프레시 토큰입니다. (DB Fail)"));

        // 3. 토큰에 연결된 사용자 정보 가져오기
        User user = refreshToken.getUser();

        // 4. 새로운 Access Token 생성
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getStudentId());

        // 5. 새 Access Token 반환
        return new AccessTokenResponse(newAccessToken);
    }
}