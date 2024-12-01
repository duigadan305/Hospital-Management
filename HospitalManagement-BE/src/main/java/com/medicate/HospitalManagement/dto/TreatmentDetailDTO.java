package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class TreatmentDetailDTO {

    private Long id;
    private String status;
    private String reason;
    private String prescriptionType;
    private String priliminaryDiagnosis;
    private String finallyDiagnosis;
    private Integer followUpDate;
    private List<String> medicalHistory;
    private Map<String, Object> vitalSign;
    private List<Map<String, Object>> bodyExamination;
    private List<Map<String, Object>> partExamination;
    private AppointmentDTO appointment;
}
