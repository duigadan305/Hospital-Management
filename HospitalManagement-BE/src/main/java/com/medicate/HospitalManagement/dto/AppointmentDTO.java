package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentDTO {

    private Long id;
    private String appointmentTime;
    private String status;
    private String payment;
    private String type;
    private String reason;
    private LocalDate appointmentDate;
    private PatientDTO patient;
    private DoctorDTO doctor;
}
