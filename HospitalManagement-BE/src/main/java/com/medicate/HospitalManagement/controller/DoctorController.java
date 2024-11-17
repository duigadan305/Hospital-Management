package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.CommentDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.service.Interface.IDoctorService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
    @Autowired
    private IDoctorService doctorService;

    @PostMapping("/getAppointmentByDoctorID")
    public ResponseEntity<Response> getAppointmentByDoctorID(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = doctorService.getAppointmentByDoctorID(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
