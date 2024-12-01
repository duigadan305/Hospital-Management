package com.medicate.HospitalManagement.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.w3c.dom.ls.LSException;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
    private int statusCode;
    private String message;
    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmCode;
    private UserDTO user;
    private PatientDTO patient;
    private EmployeeDTO employee;
    private DoctorDTO doctor;
    private CommentDTO comment;
    private AppointmentDTO appointment;
    private TreatmentDetailDTO treatmentDetail;
    private TreatmentServiceDTO treatmentService;
    private ExamServiceDTO service;
    private PrescriptionDTO prescription;
    private MedicalRecordDTO medicalRecord;
    private List<UserDTO> userList;
    private List<PatientDTO> patientList;
    private List<EmployeeDTO> employeeList;
    private List<DoctorDTO> doctorList;
    private List<CommentDTO> commentList;
    private List<AppointmentDTO> appointmentList;
    private List<TreatmentDetailDTO> treatmentDetailList;
    private List<TreatmentServiceDTO> treatmentServiceList;
    private List<ExamServiceDTO> serviceList;
    private List<PrescriptionDTO> prescriptionList;
    private List<MedicalRecordDTO> medicalRecordList;
    private String otp;
    private LocalDateTime expiryTime;
    private Integer total;
}
