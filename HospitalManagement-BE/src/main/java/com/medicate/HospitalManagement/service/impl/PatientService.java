package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.DateUtils;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import com.medicate.HospitalManagement.ws.configuration.NotificationController;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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
    @Autowired
    private DrugAllergyRepo drugAllergyRepository;
    @Autowired
    public NotificationController notificationController;

    @Override
    public Response updatePatientInfo(PatientDTO patientDTO) {
        Response response = new Response();
        try {

            Patient patient = patientRepository.findById(patientDTO.getId())
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
            if (patientDTO.getEthnicity() != null) { // Assuming dob is a date, check only for null
                patient.setEthnicity(patientDTO.getEthnicity());
            }
            if (patientDTO.getJob() != null) { // Assuming dob is a date, check only for null
                patient.setJob(patientDTO.getJob());
            }
            if (patientDTO.getWorkPlace() != null) { // Assuming dob is a date, check only for null
                patient.setWorkPlace(patientDTO.getWorkPlace());
            }
            if (patientDTO.getHealthInsuranceNumber() != null) { // Assuming dob is a date, check only for null
                patient.setHealthInsuranceNumber(patientDTO.getHealthInsuranceNumber());
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
            com.setType(comment.getType());
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
            appointment.setStatus("Pending");
            appointment.setType("First");
            appointment.setPayment("No");
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

    @Override
    public Response getAllAppointment(AppointmentDTO appointment) {
        Response response = new Response();
        List<Appointment> appointmentList = new ArrayList<>();
        try {
            appointmentList = appointmentRepository.findByPatientId(appointment.getPatient().getId());
            List<AppointmentDTO> appointmentDTOList = Utils.mapAppointmentListEntityToAppointmentListDTO(appointmentList, treatmentDetailRepository);
            response.setStatusCode(200);
            response.setAppointmentList(appointmentDTOList);
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
    public Response getPatientById(Long id) {
        Response response = new Response();

        try {
            Patient patient = patientRepository.findById(id).orElseThrow(() -> new OurException("Patient Not Found"));
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
    public Response addDrugAllergy(DrugAllergyDTO drugAllergyDTO) {
        Response response = new Response();

        try {
            DrugAllergy drugAllergy = new DrugAllergy();
            Patient patient = patientRepository.findById(drugAllergyDTO.getPatient().getId()).get();
            drugAllergy.setDrugAllergy(drugAllergyDTO.getDrugAllergy());
            drugAllergy.setPatient(patient);
            drugAllergyRepository.save(drugAllergy);
            response.setStatusCode(200);
            response.setDrugAllergy(drugAllergyDTO);
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
    public Response getAllPatientComment(Long id) {
        Response response = new Response();

        try {
            List<Comment> commentList= commentRepository.findByPatientId(id);
            List<CommentDTO> commentDTOList = Utils.mapCommentListEntityToCommentListDTO(commentList);
            response.setStatusCode(200);
            response.setCommentList(commentDTOList);
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
    public Response updateComment(CommentDTO commentDTO) {
        Response response = new Response();

        try {
            Comment comment= commentRepository.findById(commentDTO.getId()).get();
            if(commentDTO.getType().equals("Review")){
                comment.setStar(commentDTO.getStar());
            }
            comment.setSubject(commentDTO.getSubject());
            comment.setContent(commentDTO.getContent());
            response.setStatusCode(200);
            response.setComment(commentDTO);
            response.setMessage("successful");
            commentRepository.save(comment);
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
    public Response deleteComment(Long id) {
        Response response = new Response();

        try {
            Comment comment= commentRepository.findById(id).get();
            commentRepository.delete(comment);
            response.setStatusCode(200);
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

    @Scheduled(cron = "0 12 22 * * ?") // Chạy lúc 9:00 sáng mỗi ngày
    public void notifyUpcomingAppointments() {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        List<Appointment> appointments = appointmentRepository.findAll(); // Lấy tất cả lịch hẹn

        for (Appointment appointment : appointments) {
            // Chuyển đổi appointmentTime từ String sang LocalDateTime
            Optional<LocalDateTime> optionalDateTime = DateUtils.parseStringToDateTime(appointment.getAppointmentTime());

            if (optionalDateTime.isPresent()) {
                LocalDateTime appointmentDateTime = optionalDateTime.get();

                // Kiểm tra nếu lịch hẹn rơi vào ngày mai
                if (appointmentDateTime.toLocalDate().equals(tomorrow)) {
                    String patientEmail = (appointment.getPatient().getUser().getEmail()).split("@")[0];
                    String message = "Bạn có lịch hẹn vào ngày " + appointment.getAppointmentTime() + ". Vui lòng đến đúng giờ.";
                    notificationController.sendAppointmentNotification(patientEmail,message);
                }
            } else {
                System.err.println("Lỗi: Không thể phân tích appointmentTime cho ID " + appointment.getId());
            }
        }
    }

}
