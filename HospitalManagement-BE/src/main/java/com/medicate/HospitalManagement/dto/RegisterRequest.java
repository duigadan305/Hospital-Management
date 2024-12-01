package com.medicate.HospitalManagement.dto;

import com.medicate.HospitalManagement.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegisterRequest {
    private User user;
    private String token;
    private LocalDateTime expiryTime;
}
