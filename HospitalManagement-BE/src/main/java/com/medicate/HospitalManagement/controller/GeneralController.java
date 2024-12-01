package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.service.Interface.IGeneralService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/general")
public class GeneralController {
    @Autowired
    private IGeneralService generalService;
    @Autowired
    private IPatientService patientService;

    @GetMapping("/allSpecialty")
    public ResponseEntity<List<Specialty>> getAllSpecialty() {
        List<Specialty> specialtyList = generalService.getAllSpecialty();
        return ResponseEntity.status(200).body(specialtyList);
    }

    @PostMapping("/allDoctors")
    public ResponseEntity<Response> getAllDoctors(@RequestBody DoctorDTO doctorRequest) {
        Response response = generalService.getAllDoctors(doctorRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getDoctorById")
    public ResponseEntity<Response> getDoctorById(@RequestBody DoctorDTO doctorRequest) {
        Response response = generalService.getDoctorById(doctorRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getAllReviewDoctor")
    public ResponseEntity<Response> getAllReviewDoctor(@RequestBody DoctorDTO doctorRequest) {
        Response response = generalService.getAllReviewDoctor(doctorRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/bookAppointment")
    public ResponseEntity<Response> bookAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = patientService.bookAppointment(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/allService")
    public ResponseEntity<Response> getAllService() {
        Response response = generalService.getAllService();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
