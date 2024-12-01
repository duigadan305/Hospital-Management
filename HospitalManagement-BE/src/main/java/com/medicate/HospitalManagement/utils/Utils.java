package com.medicate.HospitalManagement.utils;

//import com.hotelbooking.KingHotel.DTO.BookingDTO;
//import com.hotelbooking.KingHotel.DTO.RoomDTO;
//import com.hotelbooking.KingHotel.DTO.UserDTO;
//import com.hotelbooking.KingHotel.Entity.Booking;
//import com.hotelbooking.KingHotel.Entity.Room;
//import com.hotelbooking.KingHotel.Entity.RoomImage;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.repo.EmployeeRepo;
import com.medicate.HospitalManagement.repo.TreatmentDetailRepo;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();
    private static TreatmentDetailRepo treatmentDetailRepository;

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }


    public static UserDTO mapUserEntityToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static SpecialtyDTO mapSpecialtyEntityToSpecialtyDTO(Specialty specialty) {
        SpecialtyDTO specialtyDTO = new SpecialtyDTO();

        specialtyDTO.setId(specialty.getId());
        specialtyDTO.setName(specialty.getName());
        specialtyDTO.setDescription(specialty.getDescription());
        return specialtyDTO;
    }

    public static PatientDTO mapPatientEntityToPatientDTO(Patient patient) {
        PatientDTO patientDTO = new PatientDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(patient.getUser());
        patientDTO.setId(patient.getId());
        patientDTO.setName(patient.getUser().getName());
        patientDTO.setAvatar(patient.getAvatar());
        patientDTO.setDob(patient.getDob());
        patientDTO.setGender(patient.getGender());
        patientDTO.setBloodGroup(patient.getBloodGroup());
        patientDTO.setCity(patient.getCity());
        patientDTO.setCountry(patient.getCountry());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setEthnicity(patient.getEthnicity());
        patientDTO.setJob(patient.getJob());
        patientDTO.setWorkPlace(patient.getWorkPlace());
        patientDTO.setHealthInsuranceNumber(patient.getHealthInsuranceNumber());
        patientDTO.setUser(userDTO);
        return patientDTO;
    }

    public static EmployeeDTO mapEmployeeEntityToEmployeeDTO(Employee employee) {
        EmployeeDTO employeeDTO = new EmployeeDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(employee.getUser());
        employeeDTO.setId(employee.getId());
        employeeDTO.setName(employee.getUser().getName());
        employeeDTO.setAvatar(employee.getAvatar());
        employeeDTO.setDob(employee.getDob());
        employeeDTO.setGender(employee.getGender());
        employeeDTO.setCity(employee.getCity());
        employeeDTO.setCountry(employee.getCountry());
        employeeDTO.setAddress(employee.getAddress());
        employeeDTO.setEthnicity(employee.getEthnicity());
        employeeDTO.setHealthInsuranceNumber(employee.getHealthInsuranceNumber());
        employeeDTO.setUser(userDTO);
        return employeeDTO;
    }

    public static DoctorDTO mapDoctorEntityToDoctorDTO(Doctor doctor) {
        DoctorDTO doctorDTO = new DoctorDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(doctor.getUser());
        SpecialtyDTO specialtyDTO = Utils.mapSpecialtyEntityToSpecialtyDTO(doctor.getSpecialty());
        doctorDTO.setId(doctor.getId());
        doctorDTO.setDob(doctor.getDob());
        doctorDTO.setGender(doctor.getGender());
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        doctorDTO.setCity(doctor.getCity());
        doctorDTO.setCountry(doctor.getCountry());
        doctorDTO.setAddress(doctor.getAddress());
        doctorDTO.setSpecialty(specialtyDTO);
        doctorDTO.setUser(userDTO);
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        return doctorDTO;
    }

    public static CommentDTO mapCommentEntityToCommentDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(comment.getPatient());
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(comment.getDoctor());
        commentDTO.setId(comment.getId());
        commentDTO.setSubject(comment.getSubject());
        commentDTO.setContent(comment.getContent());
        commentDTO.setSendDate(comment.getSendDate());
        commentDTO.setStar(comment.getStar());
        commentDTO.setPatient(patientDTO);
        commentDTO.setDoctor(doctorDTO);
        return commentDTO;
    }

    public static AppointmentDTO mapAppointmentEntityToAppointmentDTO(Appointment appointment, TreatmentDetailRepo treatmentDetailRepository) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(appointment.getPatient());
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(appointment.getDoctor());
        appointmentDTO.setId(appointment.getId());
        appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
        var treatmentDetail = treatmentDetailRepository.findByAppointmentId(appointment.getId());
        if (treatmentDetail != null) {
            appointmentDTO.setReason(treatmentDetail.get().getReason());
        }
        appointmentDTO.setStatus(appointment.getStatus());
        appointmentDTO.setPayment(appointment.getPayment());
        appointmentDTO.setType(appointment.getType());
        appointmentDTO.setPatient(patientDTO);
        appointmentDTO.setDoctor(doctorDTO);
        return appointmentDTO;
    }

    public static AppointmentDTO mapAppointmentEntityToAppointmentDTO1(Appointment appointment) {
        AppointmentDTO appointmentDTO = new AppointmentDTO();
        PatientDTO patientDTO = Utils.mapPatientEntityToPatientDTO(appointment.getPatient());
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(appointment.getDoctor());
        appointmentDTO.setId(appointment.getId());
        appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
        appointmentDTO.setStatus(appointment.getStatus());
        appointmentDTO.setPayment(appointment.getPayment());
        appointmentDTO.setType(appointment.getType());
        appointmentDTO.setPatient(patientDTO);
        appointmentDTO.setDoctor(doctorDTO);
        return appointmentDTO;
    }

    public static TreatmentDetailDTO mapTreatmentDetailEntityToTreatmentDetailDTO(TreatmentDetail treatmentDetail) {
        TreatmentDetailDTO treatmentDetailDTO = new TreatmentDetailDTO();
        AppointmentDTO appointmentDTO = Utils.mapAppointmentEntityToAppointmentDTO1(treatmentDetail.getAppointment());
        treatmentDetailDTO.setId(treatmentDetail.getId());
        treatmentDetailDTO.setStatus(treatmentDetail.getStatus());
        treatmentDetailDTO.setReason(treatmentDetail.getReason());
        treatmentDetailDTO.setMedicalHistory(treatmentDetail.getMedicalHistory());
        treatmentDetailDTO.setPartExamination(treatmentDetail.getPartExamination());
        treatmentDetailDTO.setBodyExamination(treatmentDetail.getBodyExamination());
        treatmentDetailDTO.setPrescriptionType(treatmentDetail.getPrescriptionType());
        treatmentDetailDTO.setVitalSign(treatmentDetail.getVitalSign());
        treatmentDetailDTO.setPriliminaryDiagnosis(treatmentDetail.getPriliminaryDiagnosis());
        treatmentDetailDTO.setAppointment(appointmentDTO);
        treatmentDetailDTO.setFinallyDiagnosis(treatmentDetail.getFinallyDiagnosis());
        return treatmentDetailDTO;
    }

    public static ExamServiceDTO mapExamServiceEntityToExamServiceDTO(ExamService service) {
        ExamServiceDTO serviceDTO = new ExamServiceDTO();
        serviceDTO.setId(service.getId());
        serviceDTO.setName(service.getName());
        serviceDTO.setCode(service.getCode());
        serviceDTO.setDescription(service.getDescription());
        serviceDTO.setCost(service.getCost());
        return serviceDTO;
    }

    public static TreatmentServiceDTO mapTreatmentServiceEntityToTreatmentServiceDTO(TreatmentService treatmentService) {
        TreatmentServiceDTO treatmentServiceDTO = new TreatmentServiceDTO();
        ExamServiceDTO serviceDTO = Utils.mapExamServiceEntityToExamServiceDTO(treatmentService.getExamService());
        AppointmentDTO appointmentDTO = Utils.mapAppointmentEntityToAppointmentDTO1(treatmentService.getAppointment());
        treatmentServiceDTO.setId(treatmentService.getId());
        treatmentServiceDTO.setService(serviceDTO);
        treatmentServiceDTO.setAppointment(appointmentDTO);
        treatmentServiceDTO.setFileName(treatmentService.getFileName());
        treatmentServiceDTO.setFileContent(treatmentService.getFileContent());
        treatmentServiceDTO.setResult(treatmentService.getResult());
        return treatmentServiceDTO;
    }

    public static PrescriptionDTO mapPrescriptionEntityToPresciptionDTO(Prescription prescription) {
        PrescriptionDTO prescriptionDTO = new PrescriptionDTO();
        AppointmentDTO appointmentDTO = Utils.mapAppointmentEntityToAppointmentDTO1(prescription.getAppointment());
        prescriptionDTO.setId(prescriptionDTO.getId());
        prescriptionDTO.setDrugName(prescription.getDrugName());
        prescriptionDTO.setAppointment(appointmentDTO);
        prescriptionDTO.setDosage(prescription.getDosage());
        prescriptionDTO.setQuantity(prescription.getQuantity());
        prescriptionDTO.setUnit(prescription.getUnit());
        prescriptionDTO.setUsageInstruction(prescription.getUsageInstruction());
        return prescriptionDTO;
    }

    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static List<PatientDTO> mapPatientListEntityToPatientListDTO(List<Patient> patientList) {
        return patientList.stream().map(Utils::mapPatientEntityToPatientDTO).collect(Collectors.toList());
    }

    public static List<EmployeeDTO> mapEmployeeListEntityToEmployeeListDTO(List<Employee> employeeList) {
        return employeeList.stream().map(Utils::mapEmployeeEntityToEmployeeDTO).collect(Collectors.toList());
    }

    public static List<DoctorDTO> mapDoctorListEntityToDoctorListDTO(List<Doctor> doctorList) {
        return doctorList.stream().map(Utils::mapDoctorEntityToDoctorDTO).collect(Collectors.toList());
    }

    public static List<CommentDTO> mapCommentListEntityToCommentListDTO(List<Comment> commentList) {
        return commentList.stream().map(Utils::mapCommentEntityToCommentDTO).collect(Collectors.toList());
    }

    public static List<AppointmentDTO> mapAppointmentListEntityToAppointmentListDTO(List<Appointment> appointmentList, TreatmentDetailRepo treatmentDetailRepository) {
        return appointmentList.stream().map(appointment -> mapAppointmentEntityToAppointmentDTO(appointment, treatmentDetailRepository)).collect(Collectors.toList());
    }

    public static List<TreatmentDetailDTO> mapTreatmentDetailListEntityToTreatmentDetailListDTO(List<TreatmentDetail> treatmentDetailList) {
        return treatmentDetailList.stream().map(treatmentDetail -> mapTreatmentDetailEntityToTreatmentDetailDTO(treatmentDetail)).collect(Collectors.toList());
    }

    public static List<ExamServiceDTO> mapServiceListEntityToServiceListDTO(List<ExamService> serviceList) {
        return serviceList.stream().map(Utils::mapExamServiceEntityToExamServiceDTO).collect(Collectors.toList());
    }

    public static List<TreatmentServiceDTO> mapTreatmentServiceListEntityToTreatmentServiceListDTO(List<TreatmentService> treatmentServiceList) {
        return treatmentServiceList.stream().map(Utils::mapTreatmentServiceEntityToTreatmentServiceDTO).collect(Collectors.toList());
    }

    public static List<PrescriptionDTO> mapPrescriptionListEntityToPresciptionListDTO(List<Prescription> prescriptionList) {
        return prescriptionList.stream().map(Utils::mapPrescriptionEntityToPresciptionDTO).collect(Collectors.toList());
    }
}
