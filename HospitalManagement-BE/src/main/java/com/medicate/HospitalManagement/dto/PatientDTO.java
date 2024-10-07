package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientDTO {

    private Long id;
    private String gender;
    private String bloodGroup;
    private String city;
    private String country;
    private String address;
    private LocalDate dob;
    private UserDTO user;
//    private List<BookingDTO> bookings = new ArrayList<>();
}
