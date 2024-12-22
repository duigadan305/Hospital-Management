package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IAdminService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import com.medicate.HospitalManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService implements IAdminService {
    @Autowired
    private EmployeeRepo employeeRepository;
    @Autowired
    private CommentRepo commentRepository;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private AppointmentBillRepo billRepository;
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private SpecialtyRepo spechialtyRepository;
    @Autowired
    private ExamServiceRepo examServiceRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;
    @Override
    public Response getAllBill() {
        Response response = new Response();

        try {
            List<AppointmentBill> appointmentBillList = billRepository.findAll();
            List<AppointmentBillDTO> appointmentBillDTOList = Utils.mapBillListEntityToBillListDTO(appointmentBillList);
            response.setStatusCode(200);
            response.setAppointmentBillList(appointmentBillDTOList);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllPatient() {
        Response response = new Response();

        try {
            List<Patient> patientList = patientRepository.findAll();
            List<PatientDTO> patientDTOList = Utils.mapPatientListEntityToPatientListDTO(patientList);
            response.setStatusCode(200);
            response.setPatientList(patientDTOList);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response addSpecialty(SpecialtyDTO specialtyDTO) {
        Response response = new Response();

        try {
            Specialty specialty = new Specialty();
            specialty.setName(specialtyDTO.getName());
            specialty.setDescription(specialtyDTO.getDescription());
            response.setStatusCode(200);
            response.setMessage("successful");
            spechialtyRepository.save(specialty);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateSpecialty(SpecialtyDTO specialtyDTO) {
        Response response = new Response();

        try {
            Specialty specialty = spechialtyRepository.findById(specialtyDTO.getId()).get();
            specialty.setName(specialtyDTO.getName());
            specialty.setDescription(specialtyDTO.getDescription());
            response.setStatusCode(200);
            response.setMessage("successful");
            spechialtyRepository.save(specialty);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteSpecialty(Long id) {
        Response response = new Response();

        try {
            Specialty specialty = spechialtyRepository.findById(id).get();
            response.setStatusCode(200);
            response.setMessage("successful");
            spechialtyRepository.delete(specialty);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response addService(ExamServiceDTO examServiceDTO) {
        Response response = new Response();

        try {
            ExamService examService = new ExamService();
            examService.setName(examServiceDTO.getName());
            examService.setCode(examServiceDTO.getCode());
            examService.setDescription(examServiceDTO.getDescription());
            examService.setCost(examServiceDTO.getCost());
            response.setStatusCode(200);
            response.setMessage("successful");
            examServiceRepository.save(examService);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateService(ExamServiceDTO examServiceDTO) {
        Response response = new Response();

        try {
            ExamService examService = examServiceRepository.findById(examServiceDTO.getId()).get();
            examService.setName(examServiceDTO.getName());
            examService.setCode(examServiceDTO.getCode());
            examService.setDescription(examServiceDTO.getDescription());
            examService.setCost(examServiceDTO.getCost());
            response.setStatusCode(200);
            response.setMessage("successful");
            examServiceRepository.save(examService);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteService(Long id) {
        Response response = new Response();

        try {
            ExamService examService = examServiceRepository.findById(id).get();
            response.setStatusCode(200);
            response.setMessage("successful");
            examServiceRepository.delete(examService);
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllUser() {
        Response response = new Response();

        try {
            List<User> userList = userRepo.findAll();
            List<UserDTO> userDTOList = Utils.mapUserListEntityToUserListDTO(userList);
            response.setStatusCode(200);
            response.setUserList(userDTOList);
            response.setMessage("successful");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response addUser(UserDTO userDTO) {
        Response response = new Response();
        User user = new User();
        try {
            if (userDTO.getRole() == null || userDTO.getRole().isBlank()) {
                userDTO.setRole("USER");
            }
            if (userRepo.existsByEmail(userDTO.getEmail())) {
                throw new OurException(userDTO.getEmail() + "đã tồn tại!");
            }
            user.setEmail(userDTO.getEmail());
            user.setName(userDTO.getName());
            user.setPhone(userDTO.getPhone());
            user.setRole(userDTO.getRole());
            String pass = "123456";
            user.setPassword(passwordEncoder.encode(pass));
            User savedUser = userRepo.save(user);
            if(userDTO.getRole().equals("USER")){
                Patient patient = new Patient();
                patient.setUser(savedUser);
                patientRepository.save(patient);
            } else if (userDTO.getRole().equals("DOCTOR")) {
                Doctor doctor = new Doctor();
                doctor.setUser(savedUser);
                doctorRepository.save(doctor);
            } else {
                Employee employee = new Employee();
                employee.setUser(savedUser);
                employeeRepository.save(employee);
            }
            sendEmailWithOtp(userDTO.getEmail(), "", "addUser");
            response.setStatusCode(200);
            response.setUser(userDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Registration " + e.getMessage());

        }
        return response;
    }

    @Override
    public Response deleteUser(Long id) {
        Response response = new Response();

        try {
            User user = userRepo.findById(id).get();
            userRepo.delete(user);
            if(user.getRole().equals("USER")){
                Patient patient = patientRepository.findByUserId(id).get();
                patientRepository.delete(patient);
            } else if (user.getRole().equals("DOCTOR")) {
                Doctor doctor = doctorRepository.findByUserEmail(user.getEmail()).get();
                doctorRepository.delete(doctor);
            } else {
                Employee employee = employeeRepository.findByUserEmail(user.getEmail()).get();
                employeeRepository.delete(employee);
            }
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateDoctorInfor(DoctorDTO doctorDTO) {
        Response response = new Response();
        try {

            Doctor doctor = doctorRepository.findById(doctorDTO.getId())
                    .orElseThrow(() -> new OurException("Doctor Not found"));

            // Cập nhật thông tin của bảng patient nếu giá trị trong patientDTO không null hoặc rỗng
            if (doctorDTO.getGender() != null && !doctorDTO.getGender().isEmpty()) {
                doctor.setGender(doctorDTO.getGender());
            }
            if (doctorDTO.getBloodGroup() != null && !doctorDTO.getBloodGroup().isEmpty()) {
                doctor.setBloodGroup(doctorDTO.getBloodGroup());
            }
            if (doctorDTO.getCity() != null && !doctorDTO.getCity().isEmpty()) {
                doctor.setCity(doctorDTO.getCity());
            }
            if (doctorDTO.getCountry() != null && !doctorDTO.getCountry().isEmpty()) {
                doctor.setCountry(doctorDTO.getCountry());
            }
            if (doctorDTO.getAddress() != null && !doctorDTO.getAddress().isEmpty()) {
                doctor.setAddress(doctorDTO.getAddress());
            }
            if (doctorDTO.getDob() != null) { // Assuming dob is a date, check only for null
                doctor.setDob(doctorDTO.getDob());
            }
            if (doctorDTO.getSpecialty().getId() != null) {
                Specialty specialty = spechialtyRepository.findById(doctorDTO.getSpecialty().getId()).get();
                doctor.setSpecialty(specialty);
            }
            // Cập nhật thông tin của bảng user
            User user = doctor.getUser();
            if (doctorDTO.getUser().getName() != null && !doctorDTO.getUser().getName().isEmpty()) {
                user.setName(doctorDTO.getUser().getName());
            }
            if (doctorDTO.getUser().getPhone() != null && !doctorDTO.getUser().getPhone().isEmpty()) {
                user.setPhone(doctorDTO.getUser().getPhone());
            }

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);

            // Lưu lại thông tin
            userRepo.save(user);
            doctorRepository.save(doctor);

            response.setStatusCode(200);
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Registration " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateEmployeeInfor(EmployeeDTO employeeDTO) {
        Response response = new Response();
        try {

            Employee employee = employeeRepository.findById(employeeDTO.getId())
                    .orElseThrow(() -> new OurException("Employee Not found"));

            // Cập nhật thông tin của bảng patient nếu giá trị trong patientDTO không null hoặc rỗng
            if (employeeDTO.getGender() != null && !employeeDTO.getGender().isEmpty()) {
                employee.setGender(employeeDTO.getGender());
            }
            if (employeeDTO.getEthnicity() != null && !employeeDTO.getEthnicity().isEmpty()) {
                employee.setEthnicity(employeeDTO.getEthnicity());
            }
            if (employeeDTO.getCity() != null && !employeeDTO.getCity().isEmpty()) {
                employee.setCity(employeeDTO.getCity());
            }
            if (employeeDTO.getCountry() != null && !employeeDTO.getCountry().isEmpty()) {
                employee.setCountry(employeeDTO.getCountry());
            }
            if (employeeDTO.getAddress() != null && !employeeDTO.getAddress().isEmpty()) {
                employee.setAddress(employeeDTO.getAddress());
            }
            if (employeeDTO.getDob() != null) { // Assuming dob is a date, check only for null
                employee.setDob(employeeDTO.getDob());
            }
            if (employeeDTO.getHealthInsuranceNumber() != null) { // Assuming dob is a date, check only for null
                employee.setHealthInsuranceNumber(employeeDTO.getHealthInsuranceNumber());
            }

            // Cập nhật thông tin của bảng user
            User user = employee.getUser();
            if (employeeDTO.getUser().getName() != null && !employeeDTO.getUser().getName().isEmpty()) {
                user.setName(employeeDTO.getUser().getName());
            }
            if (employeeDTO.getUser().getPhone() != null && !employeeDTO.getUser().getPhone().isEmpty()) {
                user.setPhone(employeeDTO.getUser().getPhone());
            }

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);

            // Lưu lại thông tin
            userRepo.save(user);
            employeeRepository.save(employee);

            response.setStatusCode(200);
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Registration " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getPatientsByCondition(PatientDTO patientDTO) {
        Response response = new Response();
        String name = patientDTO.getUser() != null ? patientDTO.getUser().getName() : null;
        String email = patientDTO.getUser() != null ? patientDTO.getUser().getEmail() : null;
        List<Patient> patientList =  patientRepository.findpatientsByCriteria(name, email);
        List<PatientDTO> patientDTOList = Utils.mapPatientListEntityToPatientListDTO(patientList);

        response.setStatusCode(200);
        response.setPatientList(patientDTOList);
        return response;
    }

    @Override
    public Response getEmployeeByCondition(EmployeeDTO employeeDTO) {
        Response response = new Response();
        String name = employeeDTO.getUser() != null ? employeeDTO.getUser().getName() : null;
        String email = employeeDTO.getUser() != null ? employeeDTO.getUser().getEmail() : null;
        String role = employeeDTO.getUser() != null ? employeeDTO.getUser().getRole() : null;
        List<Employee> employeeList =  employeeRepository.findEmployeeByCriteria(name, email, role);
        List<EmployeeDTO> employeeDTOList = Utils.mapEmployeeListEntityToEmployeeListDTO(employeeList);

        response.setStatusCode(200);
        response.setEmployeeList(employeeDTOList);
        return response;
    }

    @Override
    public Response getAllReviewContact() {
        Response response = new Response();

        try {
            List<Comment> commentList = commentRepository.findByType("Contact");
            List<CommentDTO> commentDTOList = Utils.mapCommentListEntityToCommentListDTO(commentList);
            response.setStatusCode(200);
            response.setCommentList(commentDTOList);
            response.setMessage("successful");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllDoctorReview(DoctorDTO doctorDTO) {
        Response response = new Response();
        String name = doctorDTO.getUser() != null ? doctorDTO.getUser().getName() : null;
        String email = doctorDTO.getUser() != null ? doctorDTO.getUser().getEmail() : null;
        Long specialtyId = doctorDTO.getSpecialty() != null ? doctorDTO.getSpecialty().getId() : null;
        List<Comment> commentList =  commentRepository.findCommentsByCriteria(name, email, specialtyId);
        List<CommentDTO> commentDTOList = Utils.mapCommentListEntityToCommentListDTO(commentList);

        response.setStatusCode(200);
        response.setCommentList(commentDTOList);
        return response;
    }

    @Override
    public Response deleteComment(Long id) {
        Response response = new Response();

        try {
            Comment comment = commentRepository.findById(id).get();
            commentRepository.delete(comment);
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    public void sendEmailWithOtp(String email, String content, String condition) {
        // Tạo email mới
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        if(condition.equals("sendOtp")){
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + content + "\nThis OTP will expire in 5 minutes.");
        } else if (condition.equals("confirmEmail")) {
            message.setSubject("Confirm your email");
            message.setText("Please click the link to confirm your registration:" + content + "\nThis notification will expire in 5 minutes.");
        } else if (condition.equals("addUser")) {
            message.setSubject("Thông báo cấp tài khoản");
            message.setText("Tài khoản của bạn đã được tạo:" + "\nMật khẩu mặc định: 123456" + "\nVui lòng cập nhật lại mật khẩu!");
        }


        // Gửi email
        mailSender.send(message);
    }
}
