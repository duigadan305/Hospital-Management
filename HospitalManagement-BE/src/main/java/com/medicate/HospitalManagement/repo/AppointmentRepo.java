package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Appointment;
import com.medicate.HospitalManagement.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorIdAndStatus(Long id, String status);
}
