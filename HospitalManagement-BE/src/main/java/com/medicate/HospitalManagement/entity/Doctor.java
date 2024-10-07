package com.medicate.HospitalManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
@Table(name = "doctor")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gender;
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

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialty_id")
    @JsonIgnore
    private Specialty specialty;
}
