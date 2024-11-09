package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.DoctorDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Specialty;

import java.util.List;

public interface IGeneralService {
    List<Specialty> getAllSpecialty();

    List<DoctorDTO> getAllDoctors(DoctorDTO doctorRequest);
}
