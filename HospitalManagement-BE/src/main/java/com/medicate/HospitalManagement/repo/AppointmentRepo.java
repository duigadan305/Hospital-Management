package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Appointment;
import com.medicate.HospitalManagement.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long id);
    List<Appointment> findByPatientId(Long id);

    List<Appointment> findByPatientIdAndStatus(Long id, String status);
    Optional<Appointment> findById(Long id);
    @Query("SELECT a FROM Appointment a WHERE a.status LIKE %:status%")
    List<Appointment> findByStatus(@Param("status") String status);
}
