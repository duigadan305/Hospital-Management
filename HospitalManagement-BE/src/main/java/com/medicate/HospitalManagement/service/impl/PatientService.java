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

            // Cập nhật thông tin của bảng patient nếu giá trị trong patientDTO không null hoặc rỗng
            if (patientDTO.getGender() != null && !patientDTO.getGender().isEmpty()) {
                patient.setGender(patientDTO.getGender());
            }
            if (patientDTO.getBloodGroup() != null && !patientDTO.getBloodGroup().isEmpty()) {
                patient.setBloodGroup(patientDTO.getBloodGroup());
            }
            if (patientDTO.getCity() != null && !patientDTO.getCity().isEmpty()) {
                patient.setCity(patientDTO.getCity());
            }
            if (patientDTO.getCountry() != null && !patientDTO.getCountry().isEmpty()) {
                patient.setCountry(patientDTO.getCountry());
            }
            if (patientDTO.getAddress() != null && !patientDTO.getAddress().isEmpty()) {
                patient.setAddress(patientDTO.getAddress());
            }
            if (patientDTO.getDob() != null) { // Assuming dob is a date, check only for null
                patient.setDob(patientDTO.getDob());
            }

            // Cập nhật thông tin của bảng user
            User user = patient.getUser();
            if (patientDTO.getUser().getName() != null && !patientDTO.getUser().getName().isEmpty()) {
                user.setName(patientDTO.getUser().getName());
            }
            if (patientDTO.getUser().getPhone() != null && !patientDTO.getUser().getPhone().isEmpty()) {
                user.setPhone(patientDTO.getUser().getPhone());
            }

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
            response.setMessage("Error Occurred During User Registration " + e.getMessage());
        }
        return response;
    }


    @Override
    public Response getPatientInfo(String email) {
        Response response = new Response();

        try {
            Patient patient = patientRepository.findByUserEmail(email).orElseThrow(() -> new OurException("Patient Not Found"));
            PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(patient);
            response.setStatusCode(200);
            response.setPatient(patientDTO);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }
}
