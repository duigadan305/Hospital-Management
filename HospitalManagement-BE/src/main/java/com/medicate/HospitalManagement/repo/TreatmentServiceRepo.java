package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.TreatmentService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreatmentServiceRepo extends JpaRepository<TreatmentService, Long> {
    List<TreatmentService> findByAppointmentId (Long id);
}
