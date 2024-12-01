package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class MedicalRecordDTO {
    private TreatmentDetailDTO treatmentDetail;
    private List<TreatmentServiceDTO> treatmentServiceList;
    private List<PrescriptionDTO> prescriptionList;
}
