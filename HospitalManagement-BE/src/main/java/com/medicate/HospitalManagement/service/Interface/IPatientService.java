package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.CommentDTO;
import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;

import java.util.List;

public interface IPatientService {
    Response updatePatientInfo(PatientDTO patient);
    Response getPatientInfo(String email);
    Response sendComment(CommentDTO comment);
}
