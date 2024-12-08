package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IDoctorService {
    Response getAppointmentByDoctorID(AppointmentDTO appointment);
    Response getDoctorInfo(String email);
    Response handleAppointment(AppointmentDTO appointment);
    Response getTreatmentDetail(Long id);
    Response treatAppointmentStep1(TreatmentDetailDTO treatmentDetail);
    Response treatAppointmentStep2(TreatmentDetailDTO treatmentDetail);
    Response treatAppointmentServiceStep1(TreatmentServiceDTO treatmentServiceDTO);
    Response treatAppointmentServiceStep2(Long id, String result, MultipartFile file);
    Response treatAppointmentPresciption(PrescriptionDTO prescriptionDTO);
    Response getMedicalRecord(Long id);
    Response getTreatmentService(Long id);
    Response getAppointmentById(Long id);
    Response getAppointmentByStatus(String status);
    Response getAllTreatedPatient();
    Response getAppointmentByPatientAndStatus(Long id, String status);
    Response getDrugAllergyByPatientId(Long id);
}
