package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.DoctorDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.dto.UserDTO;
import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.DoctorRepo;
import com.medicate.HospitalManagement.repo.PatientRepo;
import com.medicate.HospitalManagement.repo.SpecialtyRepo;
import com.medicate.HospitalManagement.repo.UserRepo;
import com.medicate.HospitalManagement.service.Interface.IGeneralService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeneralService implements IGeneralService {
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private SpecialtyRepo specialtyRepository;


    @Override
    public List<Specialty> getAllSpecialty() {
        return specialtyRepository.findAll();
    }

    @Override
    public List<DoctorDTO> getAllDoctors(DoctorDTO doctorRequest) {
        String name = doctorRequest.getUser() != null ? doctorRequest.getUser().getName() : null;
        String gender = doctorRequest.getGender();
        Long specialtyId = doctorRequest.getSpecialty() != null ? doctorRequest.getSpecialty().getId() : null;
        List<Doctor> doctorList =  doctorRepository.findDoctorsByCriteria(name, gender, specialtyId);
        List<DoctorDTO> doctorDTOList = new ArrayList<>();
        for (Doctor doctor : doctorList){
            DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor);
            doctorDTOList.add(doctorDTO);
        }
        return doctorDTOList;
    }
}
