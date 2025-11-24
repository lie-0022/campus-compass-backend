package com.example.campuscompassbackend.user.dto;

import lombok.Getter;

@Getter
public class AccessTokenResponse {
    private String accessToken;

    public AccessTokenResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}