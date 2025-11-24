package com.example.baekseokmapbackend.user.dto;

import lombok.Getter;

@Getter
public class LogoutRequest {
    private String refreshToken;
}