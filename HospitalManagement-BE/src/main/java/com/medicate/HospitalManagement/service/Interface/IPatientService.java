package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;

import java.util.List;

public interface IPatientService {
    Response updatePatientInfo(PatientDTO patient);
    Response getPatientInfo(String email);
    Response sendComment(CommentDTO comment);
    Response bookAppointment(AppointmentDTO appointment);
    Response getAllAppointment(AppointmentDTO appointment);
    Response getPatientById(Long id);
    Response addDrugAllergy(DrugAllergyDTO drugAllergyDTO);
}
