package com.campuscompass.backend.user.dto;

import lombok.Getter;

@Getter
public class LogoutRequest {
    private String refreshToken;
}