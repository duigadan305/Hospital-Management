package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TreatmentDetailDTO {

    private Long id;
    private String status;
    private String reason;
    private String prescriptionType;
    private String priliminaryDiagnosis;
    private String finallyDiagnosis;
    private LocalDate appointmentDate;
    private Map<String, Object> vitalSign;
    private Map<String, Object> bodyExamination;
    private Map<String, Object> partExamination;
    private AppointmentDTO appointment;
}
