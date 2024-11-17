package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Appointment;
import com.medicate.HospitalManagement.entity.TreatmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentDetailRepo extends JpaRepository<TreatmentDetail, Long> {

}
