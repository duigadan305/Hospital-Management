package com.medicate.HospitalManagement.dto;

import lombok.Data;

@Data
public class PrescriptionDTO {

    private Long id;
    private String drugName;
    private String dosage;
    private Integer quantity;
    private String unit;
    private String usageInstruction;
    private AppointmentDTO appointment;
}
