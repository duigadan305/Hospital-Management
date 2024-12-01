package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.ExamService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamServiceRepo extends JpaRepository<ExamService, Long> {
    Optional<ExamService> findByCode(String code);
}
