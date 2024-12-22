package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.*;

public interface IStaffService {
    Response getEmployeeInfo(String email);
    Response getAllAppointment();
    Response handleAppointmentPayment(AppointmentDTO appointmentDTO);
    Response addAppointmentBill(AppointmentBillDTO appointmentBillDTO);

}
