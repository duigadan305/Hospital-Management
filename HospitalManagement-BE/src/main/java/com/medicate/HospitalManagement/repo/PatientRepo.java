package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Doctor;
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
    @Query("SELECT d FROM Patient d JOIN FETCH d.user u WHERE "
            + "(:name IS NULL OR d.user.name LIKE %:name%) AND "
            + "(:email IS NULL OR d.user.email LIKE %:email%)")
    List<Patient> findpatientsByCriteria(@Param("name") String name,
                                       @Param("email") String email);
}
