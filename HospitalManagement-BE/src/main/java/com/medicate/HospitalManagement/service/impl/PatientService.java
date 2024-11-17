package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class PatientService implements IPatientService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private CommentRepo commentRepository;
    @Autowired
    private AppointmentRepo appointmentRepository;
    @Autowired
    private TreatmentDetailRepo treatmentDetailRepository;


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

    @Override
    public Response sendComment(CommentDTO comment) {
        Response response = new Response();
        Comment com = new Comment();
        try {
            PatientDTO patientDTO = new PatientDTO();
            DoctorDTO doctorDTO = new DoctorDTO();
            var patient = patientRepository.findById(comment.getPatient().getId());

            if (patient.isPresent()) {
                patientDTO = Utils.mapPatientEntityToPatientDTO(patient.get());
                comment.setPatient(patientDTO);
                com.setPatient(patient.get());
            }

            if (comment.getDoctor() != null) {
                var doctor = doctorRepository.findById(comment.getDoctor().getId());
                if(doctor.isPresent()){
                    doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor.get());
                    comment.setDoctor(doctorDTO);
                    com.setDoctor(doctor.get());
                }
            }

            com.setSubject(comment.getSubject());
            com.setContent(comment.getContent());
            com.setStar(comment.getStar());
            com.setSendDate(Timestamp.from(Instant.now()));

            commentRepository.save(com);
            response.setStatusCode(200);
            response.setComment(comment);
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

    @Override
    public Response bookAppointment(AppointmentDTO appointmentDTO) {
        Response response = new Response();
        Appointment appointment = new Appointment();
        TreatmentDetail treatmentDetail = new TreatmentDetail();
        try {

            var patient = patientRepository.findById(appointmentDTO.getPatient().getId());
            appointment.setPatient(patient.get());
            var doctor = doctorRepository.findById(appointmentDTO.getDoctor().getId());
            appointment.setDoctor(doctor.get());
            appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
            appointment.setStatus("Tiếp nhận");
            Appointment ap = appointmentRepository.save(appointment);
            treatmentDetail.setAppointment(ap);
            treatmentDetail.setReason(appointmentDTO.getReason());
            treatmentDetailRepository.save(treatmentDetail);
            response.setStatusCode(200);
            response.setAppointment(appointmentDTO);
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
