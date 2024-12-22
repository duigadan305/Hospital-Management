package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.Employee;
import com.medicate.HospitalManagement.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findById(Long id);
    Optional<Employee> findByUserEmail(String email);
    @Query("SELECT d FROM Employee d JOIN FETCH d.user u WHERE "
            + "(:name IS NULL OR d.user.name LIKE %:name%) AND "
            + "(:email IS NULL OR d.user.email LIKE %:email%) AND"
            + "(:role IS NULL OR d.user.role LIKE %:role%)")
    List<Employee> findEmployeeByCriteria(@Param("name") String name,
                                         @Param("email") String email,
                                         @Param("role") String role);
}
