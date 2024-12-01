package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
public class ExamServiceDTO {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Double cost;
}
