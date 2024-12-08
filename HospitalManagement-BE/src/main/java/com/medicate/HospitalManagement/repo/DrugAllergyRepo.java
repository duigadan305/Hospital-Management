package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Comment;
import com.medicate.HospitalManagement.entity.DrugAllergy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DrugAllergyRepo extends JpaRepository<DrugAllergy, Long> {
    List<DrugAllergy> findByPatientId(Long id);
}
