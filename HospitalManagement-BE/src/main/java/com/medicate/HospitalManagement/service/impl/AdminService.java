package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IAdminService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import com.medicate.HospitalManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class AdminService implements IAdminService {
    @Autowired
    private EmployeeRepo employeeRepository;
    @Autowired
    private AppointmentRepo appointmentRepository;
    @Autowired
    private TreatmentDetailRepo treatmentDetailRepository;
    @Autowired
    private AppointmentBillRepo billRepository;
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private PatientRepo patientRepository;


    @Override
    public Response getAllBill() {
        Response response = new Response();

        try {
            List<AppointmentBill> appointmentBillList = billRepository.findAll();
            List<AppointmentBillDTO> appointmentBillDTOList = Utils.mapBillListEntityToBillListDTO(appointmentBillList);
            response.setStatusCode(200);
            response.setAppointmentBillList(appointmentBillDTOList);
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
    public Response getAllPatient() {
        Response response = new Response();

        try {
            List<Patient> patientList = patientRepository.findAll();
            List<PatientDTO> patientDTOList = Utils.mapPatientListEntityToPatientListDTO(patientList);
            response.setStatusCode(200);
            response.setPatientList(patientDTOList);
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
