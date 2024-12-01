package com.medicate.HospitalManagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private String otp;
    private String checkedOtp;
    private LocalDateTime expiryTime;
}
