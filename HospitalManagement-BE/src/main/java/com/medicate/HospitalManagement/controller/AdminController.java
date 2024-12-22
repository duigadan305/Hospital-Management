package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.*;
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
    @PostMapping("/addSpecialty")
    public ResponseEntity<Response> addSpecialty(@RequestBody SpecialtyDTO specialtyDTO) {
        Response response = adminService.addSpecialty(specialtyDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/updateSpecialty")
    public ResponseEntity<Response> updateSpecialty(@RequestBody SpecialtyDTO specialtyDTO) {
        Response response = adminService.updateSpecialty(specialtyDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/deleteSpecialty/{id}")
    public ResponseEntity<Response> deleteSpecialty(@PathVariable("id") Long id) {
        Response response = adminService.deleteSpecialty(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/addService")
    public ResponseEntity<Response> addService(@RequestBody ExamServiceDTO examServiceDTO) {
        Response response = adminService.addService(examServiceDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/updateService")
    public ResponseEntity<Response> updateService(@RequestBody ExamServiceDTO examServiceDTO) {
        Response response = adminService.updateService(examServiceDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/deleteService/{id}")
    public ResponseEntity<Response> deleteService(@PathVariable("id") Long id) {
        Response response = adminService.deleteService(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAllUser")
    public ResponseEntity<Response> getAllUser() {
        Response response = adminService.getAllUser();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping("/addUser")
    public ResponseEntity<Response> addUser(@RequestBody UserDTO userDTO) {
        Response response = adminService.addUser(userDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Response> deleteUser(@PathVariable("id") Long id) {
        Response response = adminService.deleteUser(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/updateDoctorInfor")
    public ResponseEntity<Response> updateDoctorInfor(@RequestBody DoctorDTO doctorDTO) {
        Response response = adminService.updateDoctorInfor(doctorDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/updateEmployeeInfor")
    public ResponseEntity<Response> updateEmployeeInfor(@RequestBody EmployeeDTO employeeDTO) {
        Response response = adminService.updateEmployeeInfor(employeeDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getPatientsByCondition")
    public ResponseEntity<Response> getPatientsByCondition(@RequestBody PatientDTO patientDTO) {
        Response response = adminService.getPatientsByCondition(patientDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getEmployeeByCondition")
    public ResponseEntity<Response> getEmployeeByCondition(@RequestBody EmployeeDTO employeeDTO) {
        Response response = adminService.getEmployeeByCondition(employeeDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAllReviewContact")
    public ResponseEntity<Response> getAllReviewContact() {
        Response response = adminService.getAllReviewContact();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getAllDoctorReview")
    public ResponseEntity<Response> getAllDoctorReview(@RequestBody DoctorDTO doctorRequest) {
        Response response = adminService.getAllDoctorReview(doctorRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/deleteComment/{id}")
    public ResponseEntity<Response> deleteComment(@PathVariable("id") Long id) {
        Response response = adminService.deleteComment(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
