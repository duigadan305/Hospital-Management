package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import com.medicate.HospitalManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class StaffService implements IStaffService {
    @Autowired
    private EmployeeRepo employeeRepository;
    @Autowired
    private AppointmentRepo appointmentRepository;
    @Autowired
    private TreatmentDetailRepo treatmentDetailRepository;
    @Autowired
    private AppointmentBillRepo billRepository;

    @Override
    public Response getEmployeeInfo(String email) {
        Response response = new Response();

        try {
            Employee employee = employeeRepository.findByUserEmail(email).orElseThrow(() -> new OurException("Staff Not Found"));
            EmployeeDTO employeeDTO = Utils.mapEmployeeEntityToEmployeeDTO(employee);
            response.setStatusCode(200);
            response.setEmployee(employeeDTO);
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
    public Response getAllAppointment() {
        Response response = new Response();

        try {
            List<Appointment> appointmentList = appointmentRepository.findAll();
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
    public Response handleAppointmentPayment(AppointmentDTO appointmentDTO) {
        Response response = new Response();
        try {
            Appointment ap = appointmentRepository.findById(appointmentDTO.getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            if(appointmentDTO.getPayment() != null && appointmentDTO.getPayment() != ""){
                ap.setPayment(appointmentDTO.getPayment());
            }
            appointmentRepository.save(ap);
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

    @Override
    public Response addAppointmentBill(AppointmentBillDTO appointmentBillDTO) {
        Response response = new Response();
        try {
            AppointmentBill appointmentBill = new AppointmentBill();
            Appointment ap = appointmentRepository.findById(appointmentBillDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            appointmentBill.setAppointment(ap);
            appointmentBill.setServiceCost(appointmentBillDTO.getServiceCost());
            appointmentBill.setPrescriptionCost(appointmentBillDTO.getPrescriptionCost());
            appointmentBill.setTotal(appointmentBillDTO.getTotal());
            appointmentBill.setPayDate(new Timestamp(System.currentTimeMillis()));
            billRepository.save(appointmentBill);
            response.setAppointmentBill(appointmentBillDTO);
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
}
