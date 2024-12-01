package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Prescription;
import com.medicate.HospitalManagement.entity.TreatmentService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepo extends JpaRepository<Prescription, Long> {
    List<Prescription> findByAppointmentId (Long id);
}
