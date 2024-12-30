package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.service.Interface.IStaffService;
import com.medicate.HospitalManagement.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class StaffService implements IStaffService {
    @Autowired
    private EmployeeRepo employeeRepository;
    @Autowired
    private AppointmentRepo appointmentRepository;
    @Autowired
    private TreatmentDetailRepo treatmentDetailRepository;
    @Autowired
    private AppointmentBillRepo billRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public Response getEmployeeInfo(String email) {
        Response response = new Response();

        try {
            Employee employee = employeeRepository.findByUserEmail(email).orElseThrow(() -> new OurException("Staff Not Found"));
            EmployeeDTO employeeDTO = Utils.mapEmployeeEntityToEmployeeDTO(employee);
            response.setStatusCode(200);
            response.setEmployee(employeeDTO);
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
    public Response getAllAppointment() {
        Response response = new Response();

        try {
            List<Appointment> appointmentList = appointmentRepository.findAll();
            List<AppointmentDTO> appointmentDTOList = Utils.mapAppointmentListEntityToAppointmentListDTO(appointmentList, treatmentDetailRepository);
            response.setStatusCode(200);
            response.setAppointmentList(appointmentDTOList);
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
    public Response handleAppointmentPayment(AppointmentDTO appointmentDTO) {
        Response response = new Response();
        try {
            Appointment ap = appointmentRepository.findById(appointmentDTO.getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            if(appointmentDTO.getPayment() != null && appointmentDTO.getPayment() != ""){
                ap.setPayment(appointmentDTO.getPayment());
            }
            appointmentRepository.save(ap);
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
    public Response addAppointmentBill(AppointmentBillDTO appointmentBillDTO) {
        Response response = new Response();
        try {
            AppointmentBill appointmentBill = new AppointmentBill();
            Appointment ap = appointmentRepository.findById(appointmentBillDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            appointmentBill.setAppointment(ap);
            appointmentBill.setServiceCost(appointmentBillDTO.getServiceCost());
            appointmentBill.setPrescriptionCost(appointmentBillDTO.getPrescriptionCost());
            appointmentBill.setTotal(appointmentBillDTO.getTotal());
            appointmentBill.setPayDate(new Timestamp(System.currentTimeMillis()));
            billRepository.save(appointmentBill);
            String email = ap.getPatient().getUser().getEmail();
            String subject = "Thanh toán hóa đơn thành công";
            String content = "Thông tin hóa đơn:" + "\nPhí dịch vụ xét nghiệm: " + appointmentBillDTO.getServiceCost() + " (VND)"
                    + "\n Chi phí đơn thuốc: " + appointmentBillDTO.getPrescriptionCost() + " (VND)"
                    + "\n Tổng chi phí:" + appointmentBillDTO.getTotal() + " (VND)"
                    + "\nVui lòng truy cập hệ thống để xem hóa đơn chi tiết!";
            sendEmail(email, subject, content);
            response.setAppointmentBill(appointmentBillDTO);
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

    public void sendEmail(String email, String subject, String content) {
        // Tạo email mới
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);
        // Gửi email
        mailSender.send(message);
    }

    @Override
    public Response addAppointment(AppointmentDTO appointmentDTO) {
        Response response = new Response();
        Appointment appointment = new Appointment();
        TreatmentDetail treatmentDetail = new TreatmentDetail();
        Patient patient = new Patient();
        try {
            if(null == appointmentDTO.getPatient().getId() || appointmentDTO.getPatient().getId().equals("")){
                patient = Utils.mapPatientDTOToPatientEntity(appointmentDTO.getPatient());
                User user = Utils.mapUserDTOToUserEntity(appointmentDTO.getPatient().getUser());
                user.setPassword(passwordEncoder.encode("123456"));
                user.setRole("USER");
                user = userRepository.save(user);
                patient.setUser(user);
                patient = patientRepository.save(patient);
                String email = patient.getUser().getEmail();
                String subject = "Thông báo cấp tài khoản cho bệnh nhân mới";
                String content = "Bệnh nhân lần đầu đến khám tại phòng khám sẽ được cấp tài khoản mới trên hệ thống"
                        + "\n Link truy cập hệ thống: " + frontendUrl
                        + "\n Tên đăng nhập: " + email
                        + "\n Mật khẩu mặc định: 123456"
                        + "\nVui lòng truy cập hệ thống và đổi lại mật khẩu!";
                sendEmail(email, subject, content);
            } else {
                patient = patientRepository.findById(appointmentDTO.getPatient().getId()).get();
                updatePatientInfo(appointmentDTO.getPatient());
            }

            appointment.setPatient(patient);
            var doctor = doctorRepository.findById(appointmentDTO.getDoctor().getId());
            appointment.setDoctor(doctor.get());
            appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
            appointment.setStatus("Pending");
            appointment.setType("First");
            appointment.setPayment("No");
            Appointment ap = appointmentRepository.save(appointment);
            treatmentDetail.setAppointment(ap);
            treatmentDetail.setReason(appointmentDTO.getReason());
            treatmentDetailRepository.save(treatmentDetail);
            response.setStatusCode(200);
            response.setAppointment(appointmentDTO);
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

    public void updatePatientInfo(PatientDTO patientDTO) {
        try {

            Patient patient = patientRepository.findById(patientDTO.getId())
                    .orElseThrow(() -> new OurException("Patient Not found"));

            // Cập nhật thông tin của bảng patient nếu giá trị trong patientDTO không null hoặc rỗng
            if (patientDTO.getGender() != null && !patientDTO.getGender().isEmpty()) {
                patient.setGender(patientDTO.getGender());
            }
            if (patientDTO.getBloodGroup() != null && !patientDTO.getBloodGroup().isEmpty()) {
                patient.setBloodGroup(patientDTO.getBloodGroup());
            }
            if (patientDTO.getCity() != null && !patientDTO.getCity().isEmpty()) {
                patient.setCity(patientDTO.getCity());
            }
            if (patientDTO.getCountry() != null && !patientDTO.getCountry().isEmpty()) {
                patient.setCountry(patientDTO.getCountry());
            }
            if (patientDTO.getAddress() != null && !patientDTO.getAddress().isEmpty()) {
                patient.setAddress(patientDTO.getAddress());
            }
            if (patientDTO.getDob() != null) { // Assuming dob is a date, check only for null
                patient.setDob(patientDTO.getDob());
            }
            if (patientDTO.getEthnicity() != null) { // Assuming dob is a date, check only for null
                patient.setEthnicity(patientDTO.getEthnicity());
            }
            if (patientDTO.getJob() != null) { // Assuming dob is a date, check only for null
                patient.setJob(patientDTO.getJob());
            }
            if (patientDTO.getWorkPlace() != null) { // Assuming dob is a date, check only for null
                patient.setWorkPlace(patientDTO.getWorkPlace());
            }
            if (patientDTO.getHealthInsuranceNumber() != null) { // Assuming dob is a date, check only for null
                patient.setHealthInsuranceNumber(patientDTO.getHealthInsuranceNumber());
            }

            // Cập nhật thông tin của bảng user
            User user = patient.getUser();
            if (patientDTO.getUser().getName() != null && !patientDTO.getUser().getName().isEmpty()) {
                user.setName(patientDTO.getUser().getName());
            }
            if (patientDTO.getUser().getPhone() != null && !patientDTO.getUser().getPhone().isEmpty()) {
                user.setPhone(patientDTO.getUser().getPhone());
            }

            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);

            // Lưu lại thông tin
            userRepository.save(user);
            patientRepository.save(patient);


        } catch (OurException e) {

        } catch (Exception e) {
        }
    }
}


