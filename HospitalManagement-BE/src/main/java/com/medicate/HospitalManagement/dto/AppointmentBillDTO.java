package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class AppointmentBillDTO {

    private Long id;
    private Long serviceCost;
    private Long prescriptionCost;
    private Timestamp payDate;
    private Long total;
    private AppointmentDTO appointment;
}
