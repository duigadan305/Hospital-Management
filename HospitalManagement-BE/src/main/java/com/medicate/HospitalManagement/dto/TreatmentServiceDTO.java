package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class TreatmentServiceDTO {

    private Long id;
    private String result;
    private ExamServiceDTO service;
    private AppointmentDTO appointment;
    private byte[] fileContent;
    private String fileName;
    private MultipartFile file;
}
