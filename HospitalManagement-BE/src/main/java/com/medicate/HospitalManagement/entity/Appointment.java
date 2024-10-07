package com.medicate.HospitalManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Appointment date is required")
    private LocalDate appointmentDate;
    @NotNull(message = "Appointment time is required")
    private String appointmentTime;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id")
    @JsonIgnore
    private Doctor doctor;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;
}
