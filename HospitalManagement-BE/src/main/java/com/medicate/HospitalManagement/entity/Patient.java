package com.medicate.HospitalManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gender;
    private String job;
    private String ethnicity;
    private String workPlace;
    private String healthInsuranceNumber;
    private String bloodGroup;
    private String city;
    private String country;
    private String address;
    private LocalDate dob;

    @Column(name = "avatar", columnDefinition = "BYTEA")
    private byte[] avatar;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
