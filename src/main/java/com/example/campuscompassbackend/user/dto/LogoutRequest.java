package com.example.campuscompassbackend.user.dto;

import lombok.Getter;

@Getter
public class LogoutRequest {
    private String refreshToken;
}