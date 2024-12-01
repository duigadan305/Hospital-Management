package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.print.Doc;
import java.util.List;
import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor, Long> {

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user u JOIN FETCH d.specialty s WHERE "
            + "(:name IS NULL OR d.user.name LIKE %:name%) AND "
            + "(:gender IS NULL OR d.gender = :gender) AND "
            + "(:specialtyId IS NULL OR d.specialty.id = :specialtyId)")
    List<Doctor> findDoctorsByCriteria(@Param("name") String name,
                                       @Param("gender") String gender,
                                       @Param("specialtyId") Long specialtyId);

    Optional<Doctor> findById(Integer id);

    Optional<Doctor> findByUserEmail(String email);
}
