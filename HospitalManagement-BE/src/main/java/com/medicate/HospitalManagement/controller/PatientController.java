package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {
    @Autowired
    private IPatientService patientService;


    @GetMapping("/getPatientByEmail/{email}")
    public ResponseEntity<Response> getPatientByEmail(@PathVariable("email") String email) {
        Response response = patientService.getPatientInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/updatePatientInfo")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> updatePatientInfo(@RequestBody PatientDTO patientDTO) {
        Response response = patientService.updatePatientInfo(patientDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/sendComment")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<Response> sendComment(@RequestBody CommentDTO commentDTO) {
        Response response = patientService.sendComment(commentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/bookAppointment")
    public ResponseEntity<Response> bookAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = patientService.bookAppointment(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
