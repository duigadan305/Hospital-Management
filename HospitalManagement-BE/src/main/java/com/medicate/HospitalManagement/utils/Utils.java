package com.medicate.HospitalManagement.utils;

//import com.hotelbooking.KingHotel.DTO.BookingDTO;
//import com.hotelbooking.KingHotel.DTO.RoomDTO;
//import com.hotelbooking.KingHotel.DTO.UserDTO;
//import com.hotelbooking.KingHotel.Entity.Booking;
//import com.hotelbooking.KingHotel.Entity.Room;
//import com.hotelbooking.KingHotel.Entity.RoomImage;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }


    public static UserDTO mapUserEntityToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static SpecialtyDTO mapSpecialtyEntityToSpecialtyDTO(Specialty specialty) {
        SpecialtyDTO specialtyDTO = new SpecialtyDTO();

        specialtyDTO.setId(specialty.getId());
        specialtyDTO.setName(specialty.getName());
        specialtyDTO.setDescription(specialty.getDescription());
        return specialtyDTO;
    }

    public static PatientDTO mapPatientEntityToPatientDTO(Patient patient) {
        PatientDTO patientDTO = new PatientDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(patient.getUser());
        patientDTO.setId(patient.getId());
        patientDTO.setName(patient.getUser().getName());
        patientDTO.setDob(patient.getDob());
        patientDTO.setGender(patient.getGender());
        patientDTO.setBloodGroup(patient.getBloodGroup());
        patientDTO.setCity(patient.getCity());
        patientDTO.setCountry(patient.getCountry());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setEthnicity(patient.getEthnicity());
        patientDTO.setJob(patient.getJob());
        patientDTO.setWorkPlace(patient.getWorkPlace());
        patientDTO.setHealthInsuranceNumber(patient.getHealthInsuranceNumber());
        patientDTO.setUser(userDTO);
        return patientDTO;
    }

    public static DoctorDTO mapDoctorEntityToDoctorDTO(Doctor doctor) {
        DoctorDTO doctorDTO = new DoctorDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(doctor.getUser());
        SpecialtyDTO specialtyDTO = Utils.mapSpecialtyEntityToSpecialtyDTO(doctor.getSpecialty());
        doctorDTO.setId(doctor.getId());
        doctorDTO.setDob(doctor.getDob());
        doctorDTO.setGender(doctor.getGender());
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        doctorDTO.setCity(doctor.getCity());
        doctorDTO.setCountry(doctor.getCountry());
        doctorDTO.setAddress(doctor.getAddress());
        doctorDTO.setSpecialty(specialtyDTO);
        doctorDTO.setUser(userDTO);
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        return doctorDTO;
    }

    public static CommentDTO mapCommentEntityToCommentDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(comment.getPatient());
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(comment.getDoctor());
        commentDTO.setId(comment.getId());
        commentDTO.setSubject(comment.getSubject());
        commentDTO.setContent(comment.getContent());
        commentDTO.setSendDate(comment.getSendDate());
        commentDTO.setStar(comment.getStar());
        commentDTO.setPatient(patientDTO);
        commentDTO.setDoctor(doctorDTO);
        return commentDTO;
    }

    public static AppointmentDTO mapAppointmentEntityToAppointmentDTO(Appointment appointment) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(appointment.getPatient());
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(appointment.getDoctor());
        appointmentDTO.setId(appointment.getId());
        appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
        appointmentDTO.setPatient(patientDTO);
        appointmentDTO.setDoctor(doctorDTO);
        return appointmentDTO;
    }


    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static List<PatientDTO> mapPatientListEntityToPatientListDTO(List<Patient> patientList) {
        return patientList.stream().map(Utils::mapPatientEntityToPatientDTO).collect(Collectors.toList());
    }

    public static List<DoctorDTO> mapDoctorListEntityToDoctorListDTO(List<Doctor> doctorList) {
        return doctorList.stream().map(Utils::mapDoctorEntityToDoctorDTO).collect(Collectors.toList());
    }

    public static List<CommentDTO> mapCommentListEntityToCommentListDTO(List<Comment> commentList) {
        return commentList.stream().map(Utils::mapCommentEntityToCommentDTO).collect(Collectors.toList());
    }

    public static List<AppointmentDTO> mapAppointmentListEntityToAppointmentListDTO(List<Appointment> appointmentList) {
        return appointmentList.stream().map(Utils::mapAppointmentEntityToAppointmentDTO).collect(Collectors.toList());
    }
}
