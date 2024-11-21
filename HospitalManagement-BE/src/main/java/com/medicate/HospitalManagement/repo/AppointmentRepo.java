package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Appointment;
import com.medicate.HospitalManagement.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long id);
    List<Appointment> findByPatientId(Long id);

    Optional<Appointment> findById(Long id);
}
