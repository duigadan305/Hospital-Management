package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.*;

public interface IAdminService {
    Response getAllBill();
    Response getAllPatient();
    Response addSpecialty(SpecialtyDTO specialtyDTO);
    Response updateSpecialty(SpecialtyDTO specialtyDTO);
    Response deleteSpecialty(Long id);
    Response addService(ExamServiceDTO examServiceDTO);
    Response updateService(ExamServiceDTO examServiceDTO);
    Response deleteService(Long id);
    Response getAllUser();
    Response addUser(UserDTO userDTO);
    Response deleteUser(Long id);
    Response updateDoctorInfor(DoctorDTO doctorDTO);
    Response updateEmployeeInfor(EmployeeDTO employeeDTO);
    Response getPatientsByCondition(PatientDTO patientDTO);
    Response getEmployeeByCondition(EmployeeDTO employeeDTO);
    Response getAllReviewContact();
    Response getAllDoctorReview(DoctorDTO doctorDTO);
    Response deleteComment(Long id);
}
