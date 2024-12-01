package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.CommentDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
public class StaffController {
    @Autowired
    private IStaffService staffService;


//    @PostMapping("/updatePatientInfo")
//    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
//    public ResponseEntity<Response> updatePatientInfo(@RequestBody PatientDTO patientDTO) {
//        Response response = patientService.updatePatientInfo(patientDTO);
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }


    @GetMapping("/getStaffByEmail/{email}")
    public ResponseEntity<Response> getStaffByEmail(@PathVariable("email") String email) {
        Response response = staffService.getEmployeeInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAllAppointment")
    public ResponseEntity<Response> getAllAppointment() {
        Response response = staffService.getAllAppointment();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/handleAppointmentPayment")
    public ResponseEntity<Response> handleAppointmentPayment(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = staffService.handleAppointmentPayment(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}