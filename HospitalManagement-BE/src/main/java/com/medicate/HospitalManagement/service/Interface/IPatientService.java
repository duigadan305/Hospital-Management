package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.User;

public interface IPatientService {
    Response updatePatientInfo(PatientDTO patient);
}
