package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.service.Interface.IDoctorService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @GetMapping("/getDoctorByEmail/{email}")
    public ResponseEntity<Response> getDoctorByEmail(@PathVariable("email") String email) {
        Response response = doctorService.getDoctorInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/handleAppointment")
    public ResponseEntity<Response> handleAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = doctorService.handleAppointment(appointmentDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getTreatmentDetail/{id}")
    public ResponseEntity<Response> getTreatmentDetail(@PathVariable("id") Long id) {
        Response response = doctorService.getTreatmentDetail(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/treatAppointmentStep1")
    public ResponseEntity<Response> treatAppointment1(@RequestBody TreatmentDetailDTO treatmentDetailDTO) {
        Response response = doctorService.treatAppointmentStep1(treatmentDetailDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/treatAppointmentStep2")
    public ResponseEntity<Response> treatAppointment2(@RequestBody TreatmentDetailDTO treatmentDetailDTO) {
        Response response = doctorService.treatAppointmentStep2(treatmentDetailDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/treatAppointmentServiceStep1")
    public ResponseEntity<Response> treatAppointmentService1(@RequestBody TreatmentServiceDTO treatmentServiceDTO) {
        Response response = doctorService.treatAppointmentServiceStep1(treatmentServiceDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping(value = "/treatAppointmentServiceStep2", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> treatAppointmentService2(@RequestParam(value = "id", required = false) Long id,
                                                             @RequestParam(value = "result", required = false) String result,
                                                             @RequestParam(value = "file", required = false) MultipartFile file) {
        Response response = doctorService.treatAppointmentServiceStep2(id, result, file);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getMedicalRecord/{id}")
    public ResponseEntity<Response> getMedicalRecord(@PathVariable("id") Long id) {
        Response response = doctorService.getMedicalRecord(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/treatAppointmentPrescription")
    public ResponseEntity<Response> treatAppointmentPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        Response response = doctorService.treatAppointmentPresciption(prescriptionDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getTreatmentService/{id}")
    public ResponseEntity<Response> getTreatmentService(@PathVariable("id") Long id) {
        Response response = doctorService.getTreatmentService(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAppointmentById/{id}")
    public ResponseEntity<Response> getAppointmentById(@PathVariable("id") Long id) {
        Response response = doctorService.getAppointmentById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAppointmentByStatus/{status}")
    public ResponseEntity<Response> getAppointmentByStatus(@PathVariable("status") String status) {
        Response response = doctorService.getAppointmentByStatus(status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/getAllTreatedPatient")
    public ResponseEntity<Response> getAllTreatedPatient() {
        Response response = doctorService.getAllTreatedPatient();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/getAppointmentByPatientAndStatus")
    public ResponseEntity<Response> getAppointmentByPatientAndStatus(@RequestBody AppointmentDTO appointmentDTO) {
        Response response = doctorService.getAppointmentByPatientAndStatus(appointmentDTO.getPatient().getId(), appointmentDTO.getStatus());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
