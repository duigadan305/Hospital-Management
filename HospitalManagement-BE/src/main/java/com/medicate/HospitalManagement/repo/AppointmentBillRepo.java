package com.medicate.HospitalManagement.repo;

import com.medicate.HospitalManagement.entity.AppointmentBill;
import com.medicate.HospitalManagement.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentBillRepo extends JpaRepository<AppointmentBill, Long> {

}
