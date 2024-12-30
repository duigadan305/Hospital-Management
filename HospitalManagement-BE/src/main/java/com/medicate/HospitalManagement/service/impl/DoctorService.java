package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IDoctorService;
import com.medicate.HospitalManagement.utils.Utils;
import com.medicate.HospitalManagement.ws.configuration.CustomNotificationHandler;
import com.medicate.HospitalManagement.ws.configuration.NotificationController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService implements IDoctorService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private CommentRepo commentRepository;
    @Autowired
    private AppointmentRepo appointmentRepository;
    @Autowired
    private TreatmentDetailRepo treatmentDetailRepository;
    @Autowired
    private ExamServiceRepo examServiceRepository;
    @Autowired
    private TreatmentServiceRepo treatmentServiceRepository;
    @Autowired
    private PrescriptionRepo prescriptionRepository;
    @Autowired
    private DrugAllergyRepo drugAllergyRepository;
    @Autowired
    public NotificationController notificationController;
    @Autowired
    private JavaMailSender mailSender;
    @Override
    public Response getAppointmentByDoctorID(AppointmentDTO appointment) {
        Response response = new Response();
        List<Appointment> appointmentList = new ArrayList<>();
        try {
            appointmentList = appointmentRepository.findByDoctorId(appointment.getDoctor().getId());
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
    public Response getDoctorInfo(String email) {
        Response response = new Response();

        try {
            Doctor doctor = doctorRepository.findByUserEmail(email).orElseThrow(() -> new OurException("Patient Not Found"));
            DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor);
            response.setStatusCode(200);
            response.setDoctor(doctorDTO);
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
    public Response handleAppointment(AppointmentDTO appointment) {
        Response response = new Response();

        try {
            Appointment ap = appointmentRepository.findById(appointment.getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            String status = "";
            if(appointment.getStatus() != null && appointment.getStatus() != ""){
                ap.setStatus(appointment.getStatus());
                status = appointment.getStatus();
            }
            String email = (ap.getPatient().getUser().getEmail()).split("@")[0];;
            String emaill = ap.getPatient().getUser().getEmail();
            String subject = "Thông báo về lịch hẹn khám";
            appointmentRepository.save(ap);
            response.setStatusCode(200);
            response.setMessage("successful");
            if(status.equals("Pended")){
                String mess = "Lịch hẹn vào lúc " + ap.getAppointmentTime() + " đã được tiếp nhận";
                notificationController.sendAppointmentNotification(email,mess);
                sendEmail(emaill, subject, mess);
            } else if (status.equals("Cancel")) {
                String mess = "Lịch hẹn vào lúc " + ap.getAppointmentTime() + " đã bị hủy";
                notificationController.sendAppointmentNotification(email,mess);
                sendEmail(emaill, subject, mess);
            } else if (status.equals("Accepted")) {
                String mess = "Lịch hẹn vào lúc " + ap.getAppointmentTime() + " đã được bác sĩ chấp nhận";
                notificationController.sendAppointmentNotification(email,mess);
                sendEmail(emaill, subject, mess);
            }


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
    public Response getTreatmentDetail(Long id) {
        Response response = new Response();

        try {
            TreatmentDetail treatmentDetail = treatmentDetailRepository.findByAppointmentId(id).orElseThrow(() -> new OurException("Appointment Not Found"));
            TreatmentDetailDTO treatmentDetailDTO = Utils.mapTreatmentDetailEntityToTreatmentDetailDTO(treatmentDetail);
            response.setStatusCode(200);
            response.setTreatmentDetail(treatmentDetailDTO);
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
    public Response treatAppointmentStep1(TreatmentDetailDTO treatmentDetailDTO) {

        Response response = new Response();

        try {
            TreatmentDetail treatmentDetail = treatmentDetailRepository.findByAppointmentId(treatmentDetailDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("TreatmentDetail Not found"));
            Appointment ap = appointmentRepository.findById(treatmentDetailDTO.getAppointment().getId()).get();
            treatmentDetail.setMedicalHistory(treatmentDetailDTO.getMedicalHistory());
            treatmentDetail.setVitalSign(treatmentDetailDTO.getVitalSign());
            treatmentDetail.setBodyExamination(treatmentDetailDTO.getBodyExamination());
            treatmentDetail.setPartExamination(treatmentDetailDTO.getPartExamination());
            treatmentDetail.setPriliminaryDiagnosis(treatmentDetailDTO.getPriliminaryDiagnosis());
            treatmentDetail.setFinallyDiagnosis(treatmentDetailDTO.getFinallyDiagnosis());
            treatmentDetail.setPrescriptionType(treatmentDetailDTO.getPrescriptionType());
            treatmentDetailRepository.save(treatmentDetail);
            ap.setStatus("Treated");
            appointmentRepository.save(ap);
            response.setStatusCode(200);
            response.setTreatmentDetail(treatmentDetailDTO);
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
    public Response treatAppointmentStep2(TreatmentDetailDTO treatmentDetailDTO) {
        Response response = new Response();

        try {
            TreatmentDetail treatmentDetail = treatmentDetailRepository.findByAppointmentId(treatmentDetailDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("TreatmentDetail Not found"));
            Appointment ap = appointmentRepository.findById(treatmentDetailDTO.getAppointment().getId()).get();
            treatmentDetail.setFinallyDiagnosis(treatmentDetailDTO.getFinallyDiagnosis());
            treatmentDetail.setPrescriptionType(treatmentDetailDTO.getPrescriptionType());
            treatmentDetail.setFollowUpDate(treatmentDetailDTO.getFollowUpDate());
            treatmentDetail.setReason(treatmentDetailDTO.getReason());
            treatmentDetail.setDrugAllergy(treatmentDetailDTO.getDrugAllergy());
            treatmentDetailRepository.save(treatmentDetail);
            ap.setStatus("Treated");
            appointmentRepository.save(ap);
            if(null != treatmentDetailDTO.getFollowUpDate() && treatmentDetailDTO.getFollowUpDate() > 0){
                Appointment followUpAp = new Appointment();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a");
                LocalDateTime oldDateTime = LocalDateTime.parse(ap.getAppointmentTime(), formatter);
                LocalDateTime newDateTime = oldDateTime.plusDays(treatmentDetailDTO.getFollowUpDate());
                String newAppointmentTime = newDateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm a"));
                followUpAp.setType("FollowUp");
                followUpAp.setDoctor(ap.getDoctor());
                followUpAp.setPatient(ap.getPatient());
                followUpAp.setStatus("Pending");
                followUpAp.setPayment("No");
                followUpAp.setAppointmentTime(newAppointmentTime);
                appointmentRepository.save(followUpAp);
                TreatmentDetail treatmentDetail1 = new TreatmentDetail();
                treatmentDetail1.setAppointment(followUpAp);
                treatmentDetail1.setReason(treatmentDetailDTO.getReason());
                treatmentDetailRepository.save(treatmentDetail1);
            }
            response.setStatusCode(200);
            response.setTreatmentDetail(treatmentDetailDTO);
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
    public Response treatAppointmentServiceStep1(TreatmentServiceDTO treatmentServiceDTO) {
        Response response = new Response();

        try {
            TreatmentService treatmentService = new TreatmentService();
            ExamService service = examServiceRepository.findByCode(treatmentServiceDTO.getService().getCode())
                    .orElseThrow(() -> new OurException("ExamService Not found"));
            Appointment appointment = appointmentRepository.findById(treatmentServiceDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            treatmentService.setAppointment(appointment);
            treatmentService.setExamService(service);
            if(treatmentServiceDTO.getResult() != null && treatmentServiceDTO.getResult() != ""){
                treatmentService.setResult(treatmentServiceDTO.getResult());
            }
            treatmentServiceRepository.save(treatmentService);
            response.setStatusCode(200);
            response.setTreatmentService(treatmentServiceDTO);
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
    public Response treatAppointmentServiceStep2(Long id, String result, MultipartFile file) {

        Response response = new Response();

        try {
            TreatmentService treatmentService = treatmentServiceRepository.findById(id).get();
            if(result != null && !result.isEmpty()){
                treatmentService.setResult(result);
            }
            if(file != null && !file.isEmpty()){
                treatmentService.setFileName(file.getOriginalFilename());
                treatmentService.setFileContent(file.getBytes());
            }
            treatmentServiceRepository.save(treatmentService);

            response.setStatusCode(200);
//            response.setTreatmentService(treatmentServiceDTO);
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
    public Response treatAppointmentPresciption(PrescriptionDTO prescriptionDTO) {
        Response response = new Response();

        try {
            Prescription prescription = new Prescription();
            Appointment appointment = appointmentRepository.findById(prescriptionDTO.getAppointment().getId())
                    .orElseThrow(() -> new OurException("Appointment Not found"));
            prescription.setAppointment(appointment);
            prescription.setDrugName(prescriptionDTO.getDrugName());
            prescription.setDosage(prescriptionDTO.getDosage());
            prescription.setQuantity(prescriptionDTO.getQuantity());
            prescription.setUnit(prescriptionDTO.getUnit());
            prescription.setUsageInstruction(prescriptionDTO.getUsageInstruction());

            prescriptionRepository.save(prescription);
            response.setStatusCode(200);
            response.setPrescription(prescriptionDTO);
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
    public Response getMedicalRecord(Long id) {
        Response response = new Response();

        try {
            MedicalRecordDTO medicalRecordDTO = new MedicalRecordDTO();
           TreatmentDetail treatmentDetail = treatmentDetailRepository.findByAppointmentId(id).get();
           List<TreatmentService> treatmentServiceList = treatmentServiceRepository.findByAppointmentId(id);
           List<Prescription> prescriptionList = prescriptionRepository.findByAppointmentId(id);
           medicalRecordDTO.setTreatmentDetail(Utils.mapTreatmentDetailEntityToTreatmentDetailDTO(treatmentDetail));
           if(treatmentServiceList.size()>0){
               medicalRecordDTO.setTreatmentServiceList(Utils.mapTreatmentServiceListEntityToTreatmentServiceListDTO(treatmentServiceList));
           }
           if(prescriptionList.size()>0){
               medicalRecordDTO.setPrescriptionList(Utils.mapPrescriptionListEntityToPresciptionListDTO(prescriptionList));
           }
           response.setStatusCode(200);
           response.setMedicalRecord(medicalRecordDTO);
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
    public Response getTreatmentService(Long id) {
        Response response = new Response();

        try {
            List<TreatmentService> treatmentServiceList = treatmentServiceRepository.findByAppointmentId(id);
            List<TreatmentServiceDTO> treatmentServiceDTOList = Utils.mapTreatmentServiceListEntityToTreatmentServiceListDTO(treatmentServiceList);
            response.setStatusCode(200);
            response.setTreatmentServiceList(treatmentServiceDTOList);
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
    public Response getAppointmentById(Long id) {
        Response response = new Response();

        try {
            Appointment appointment = appointmentRepository.findById(id).get();
            AppointmentDTO appointmentDTO = Utils.mapAppointmentEntityToAppointmentDTO(appointment, treatmentDetailRepository);
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

    @Override
    public Response getAppointmentByStatus(String status) {
        Response response = new Response();

        try {
            List<Appointment> appointment = appointmentRepository.findByStatus(status);
            List<AppointmentDTO> appointmentDTOList = Utils.mapAppointmentListEntityToAppointmentListDTO(appointment, treatmentDetailRepository);
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
    public Response getAllTreatedPatient() {
        Response response = new Response();

        try {
            List<Patient> patientList = patientRepository.findPatientsByAppointmentStatus("Treated");
            List<PatientDTO> patientDTOList = Utils.mapPatientListEntityToPatientListDTO(patientList);
            response.setStatusCode(200);
            response.setPatientList(patientDTOList);
            response.setTotal(patientDTOList.size());
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
    public Response getAppointmentByPatientAndStatus(Long id, String status) {
        Response response = new Response();

        try {
            List<Appointment> appointmentList = appointmentRepository.findByPatientIdAndStatus(id, status);
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
    public Response getDrugAllergyByPatientId(Long id) {
        Response response = new Response();

        try {
            List<DrugAllergy> drugAllergyList = drugAllergyRepository.findByPatientId(id);
            List<DrugAllergyDTO> drugAllergyDTOList = Utils.mapDrugAllergyListEntityToDrugAllergyListDTO(drugAllergyList);
            response.setStatusCode(200);
            response.setDrugAllergyList(drugAllergyDTOList);
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
    public Response deleteTreatmentService(Long id) {
        Response response = new Response();

        try {
            List<TreatmentService> treatmentServiceList = treatmentServiceRepository.findByAppointmentId(id);
            for(TreatmentService treatmentService : treatmentServiceList){
                treatmentServiceRepository.delete(treatmentService);
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

    public void sendEmail(String email, String subject, String content) {
        // Tạo email mới
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);
        // Gửi email
        mailSender.send(message);
    }
}
