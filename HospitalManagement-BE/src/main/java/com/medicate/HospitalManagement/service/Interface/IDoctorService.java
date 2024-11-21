package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.CommentDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;

public interface IDoctorService {
    Response getAppointmentByDoctorID(AppointmentDTO appointment);
    Response getDoctorInfo(String email);
    Response handleAppointment(AppointmentDTO appointment);
}
