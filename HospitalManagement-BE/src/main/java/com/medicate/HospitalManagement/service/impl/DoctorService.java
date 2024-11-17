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
            appointmentList = appointmentRepository.findByDoctorIdAndStatus(appointment.getDoctor().getId(), "Tiếp nhận");
            List<AppointmentDTO> appointmentDTOList = Utils.mapAppointmentListEntityToAppointmentListDTO(appointmentList);
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
}
