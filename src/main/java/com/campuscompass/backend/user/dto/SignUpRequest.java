package com.campuscompass.backend.user.dto;

import lombok.Getter;

@Getter
public class SignUpRequest {
    private String student_id;
    private String password;
    private String nickname;
}