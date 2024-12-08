package com.medicate.HospitalManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.medicate.HospitalManagement.dto.VitalSign;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcType;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


import java.util.List;
import java.util.Map;

@Data
@Entity
@Table(name = "treatment_detail")
public class TreatmentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id")
    @JsonIgnore
    private Appointment appointment;

    private String reason;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> medicalHistory;

    private String status;

    //KDCV, KDTK, DNNV, KCKD
    private String prescriptionType;
    private String priliminaryDiagnosis;
    private String finallyDiagnosis;
    private String drugAllergy;
    private Integer followUpDate;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> vitalSign;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, Object>> bodyExamination;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, Object>> partExamination;

}
