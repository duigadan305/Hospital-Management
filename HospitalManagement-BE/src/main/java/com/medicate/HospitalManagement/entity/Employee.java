package com.medicate.HospitalManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gender;
    private String ethnicity;
    private String healthInsuranceNumber;
    private String cccd;
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
