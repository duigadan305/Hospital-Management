package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);

    Optional<Patient> findById(Long id);

    Optional<Patient> findByUserEmail(String email);
}
