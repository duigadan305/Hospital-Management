package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IDoctorService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService implements IDoctorService {
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
    public Response getAppointmentByDoctorID(AppointmentDTO appointment) {
        Response response = new Response();
        List<Appointment> appointmentList = new ArrayList<>();
        try {
            appointmentList = appointmentRepository.findByDoctorId(appointment.getDoctor().getId());
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
    public Response getDoctorInfo(String email) {
        Response response = new Response();

        try {
            Doctor doctor = doctorRepository.findByUserEmail(email).orElseThrow(() -> new OurException("Patient Not Found"));
            DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor);
            response.setStatusCode(200);
            response.setDoctor(doctorDTO);
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
    public Response handleAppointment(AppointmentDTO appointment) {
        Response response = new Response();

        try {
            Appointment ap = appointmentRepository.findById(appointment.getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            if(appointment.getStatus() != null && appointment.getStatus() != ""){
                ap.setStatus(appointment.getStatus());
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
}
