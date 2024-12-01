package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PatientRepo extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);
    Optional<Patient> findById(Long id);
    Optional<Patient> findByUserEmail(String email);
    @Query("SELECT DISTINCT p FROM Patient p JOIN Appointment a ON p.id = a.patient.id WHERE a.status = :status")
    List<Patient> findPatientsByAppointmentStatus(@Param("status") String status);
}
