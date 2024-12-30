package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.*;
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
    @PostMapping("/addAppointmentBill")
    public ResponseEntity<Response> addAppointmentBill(@RequestBody AppointmentBillDTO appointmentBillDTO) {
        Response response = staffService.addAppointmentBill(appointmentBillDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/addAppointment")
    public ResponseEntity<Response> addAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = staffService.addAppointment(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
