package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    private int statusCode;
    private String message;
    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmCode;
    private UserDTO user;
    private PatientDTO patient;
    private DoctorDTO doctor;
    private CommentDTO comment;
    private List<UserDTO> userList;
    private List<PatientDTO> patientList;
    private List<DoctorDTO> doctorList;
    private List<CommentDTO> commentList;
    private String otp;
    private LocalDateTime expiryTime;
    private Integer total;
}
