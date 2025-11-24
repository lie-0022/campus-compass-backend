package com.example.baekseokmapbackend.user.dto;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String student_id;
    private String password;
}