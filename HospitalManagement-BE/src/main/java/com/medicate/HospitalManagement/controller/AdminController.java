package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.AppointmentBillDTO;
import com.medicate.HospitalManagement.dto.AppointmentDTO;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.service.Interface.IAdminService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private IAdminService adminService;


//    @PostMapping("/updatePatientInfo")
//    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
//    public ResponseEntity<Response> updatePatientInfo(@RequestBody PatientDTO patientDTO) {
//        Response response = patientService.updatePatientInfo(patientDTO);
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }

    @GetMapping("/getAllBill")
    public ResponseEntity<Response> getAllBill() {
        Response response = adminService.getAllBill();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
//    @GetMapping("/getAllDoctor")
//    public ResponseEntity<Response> getAllDoctor() {
//        Response response = adminService.getAllDoctor();
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }
    @GetMapping("/getAllPatient")
    public ResponseEntity<Response> getAllPatient() {
        Response response = adminService.getAllPatient();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
//    @GetMapping("/getAllAppointment")
//    public ResponseEntity<Response> getAllPatient() {
//        Response response = adminService.getAllPatient();
//        return ResponseEntity.status(response.getStatusCode()).body(response);
//    }

}
