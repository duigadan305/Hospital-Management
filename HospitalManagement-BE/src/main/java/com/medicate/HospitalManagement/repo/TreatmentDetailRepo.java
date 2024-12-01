package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Appointment;
import com.medicate.HospitalManagement.entity.TreatmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TreatmentDetailRepo extends JpaRepository<TreatmentDetail, Long> {
    Optional<TreatmentDetail> findByAppointmentId(Long id);
}
