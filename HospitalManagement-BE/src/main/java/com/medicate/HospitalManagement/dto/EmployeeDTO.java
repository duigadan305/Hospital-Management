package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeDTO {

    private Long id;
    private String name;
    private String gender;
    private String ethnicity;
    private String healthInsuranceNumber;
    private String cccd;
    private String city;
    private String country;
    private String address;
    private byte[] avatar;
    private LocalDate dob;
    private UserDTO user;
}
