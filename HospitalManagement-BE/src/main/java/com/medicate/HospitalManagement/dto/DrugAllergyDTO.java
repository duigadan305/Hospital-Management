package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class DrugAllergyDTO {

    private Long id;
    private String drugAllergy;
    private PatientDTO patient;
}
