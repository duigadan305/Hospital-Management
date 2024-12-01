package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpecialtyRepo extends JpaRepository<Specialty, Long> {

}
