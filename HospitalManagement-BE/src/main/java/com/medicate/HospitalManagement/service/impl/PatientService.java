package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.dto.UserDTO;
import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.PatientRepo;
import com.medicate.HospitalManagement.repo.UserRepo;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PatientService implements IPatientService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private HttpSession httpSession; // Dùng để lưu trữ OTP vào session
    @Autowired
    private HttpServletResponse httpServletResponse;

    @Override
    public Response updatePatientInfo(PatientDTO patientDTO) {
        Response response = new Response();
        try {

            Patient patient = patientRepository.findByUserId(patientDTO.getUser().getId())
                    .orElseThrow(() -> new OurException("Patient Not found"));

            // Cập nhật thông tin của bảng patient
            patient.setGender(patientDTO.getGender());
            patient.setBloodGroup(patientDTO.getBloodGroup());
            patient.setCity(patientDTO.getCity());
            patient.setCountry(patientDTO.getCountry());
            patient.setAddress(patientDTO.getAddress());
            patient.setDob(patientDTO.getDob());

            // Cập nhật thông tin của bảng user
            User user = patient.getUser();
            user.setName(patientDTO.getUser().getName());
            user.setPhone(patientDTO.getUser().getPhone());
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            // Lưu lại thông tin
            userRepository.save(user);
            patientRepository.save(patient);
            response.setStatusCode(200);
            response.setUser(userDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Registration " + e.getMessage());

        }
        return response;
    }
}
