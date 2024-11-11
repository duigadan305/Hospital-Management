package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {

    private Long id;
    private String subject;
    private String content;
    private Timestamp sendDate;
    private Integer star;
    private PatientDTO patient;
    private DoctorDTO doctor;
}
