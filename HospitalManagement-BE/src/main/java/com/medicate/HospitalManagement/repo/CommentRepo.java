package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Comment;
import com.medicate.HospitalManagement.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByDoctorId(Long id);
}
