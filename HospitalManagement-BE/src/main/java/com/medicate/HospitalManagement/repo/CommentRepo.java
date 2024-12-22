package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Comment;
import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByDoctorId(Long id);
    List<Comment> findByPatientId(Long id);
    List<Comment> findByType(String type);
    @Query("SELECT c FROM Comment c WHERE c.type = 'Review' AND (1=1) "
            + "AND (:name IS NULL OR c.doctor.user.name LIKE %:name%) "
            + "AND (:email IS NULL OR c.doctor.user.email LIKE %:email%) "
            + "AND (:specialtyId IS NULL OR c.doctor.specialty.id = :specialtyId)")
    List<Comment> findCommentsByCriteria(@Param("name") String name,
                                         @Param("email") String email,
                                         @Param("specialtyId") Long specialtyId);

}
