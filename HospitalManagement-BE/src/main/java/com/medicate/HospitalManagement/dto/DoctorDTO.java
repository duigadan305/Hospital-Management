package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorDTO {

    private Long id;
    private String gender;
    private String bloodGroup;
    private String city;
    private String country;
    private String address;
    private LocalDate dob;
    private UserDTO user;
    private SpecialtyDTO specialty;
//    private List<BookingDTO> bookings = new ArrayList<>();
}
