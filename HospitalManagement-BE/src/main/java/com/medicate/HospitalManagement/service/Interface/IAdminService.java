package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.AppointmentBillDTO;
import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.Response;

public interface IAdminService {
    Response getAllBill();
    Response getAllPatient();

}
