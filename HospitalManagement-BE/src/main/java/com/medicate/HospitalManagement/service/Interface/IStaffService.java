package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.CommentDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;

public interface IStaffService {
    Response getEmployeeInfo(String email);
    Response getAllAppointment();
    Response handleAppointmentPayment(AppointmentDTO appointmentDTO);

}
