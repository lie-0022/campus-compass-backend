package com.campuscompass.backend.user.dto;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String student_id;
    private String password;
}