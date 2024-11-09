package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.DoctorDTO;
import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.service.Interface.IGeneralService;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/general")
public class GeneralController {
    @Autowired
    private IGeneralService generalService;

    @GetMapping("/allSpecialty")
    public ResponseEntity<List<Specialty>> getAllSpecialty() {
        List<Specialty> specialtyList = generalService.getAllSpecialty();
        return ResponseEntity.status(200).body(specialtyList);
    }

    @PostMapping("/allDoctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors(@RequestBody DoctorDTO doctorRequest) {
        List<DoctorDTO> doctorList = generalService.getAllDoctors(doctorRequest);
        return ResponseEntity.status(200).body(doctorList);
    }
}
