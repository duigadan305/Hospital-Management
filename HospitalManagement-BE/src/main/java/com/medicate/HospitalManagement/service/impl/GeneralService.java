package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.*;
import com.medicate.HospitalManagement.entity.*;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.*;
import com.medicate.HospitalManagement.service.Interface.IGeneralService;
import com.medicate.HospitalManagement.service.Interface.IPatientService;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeneralService implements IGeneralService {
    @Autowired
    private DoctorRepo doctorRepository;
    @Autowired
    private SpecialtyRepo specialtyRepository;
    @Autowired
    private CommentRepo commentRepository;


    @Override
    public List<Specialty> getAllSpecialty() {
        return specialtyRepository.findAll();
    }

    @Override
    public Response getAllDoctors(DoctorDTO doctorRequest) {
        Response response = new Response();
        String name = doctorRequest.getUser() != null ? doctorRequest.getUser().getName() : null;
        String gender = doctorRequest.getGender();
        Long specialtyId = doctorRequest.getSpecialty() != null ? doctorRequest.getSpecialty().getId() : null;
        List<Doctor> doctorList =  doctorRepository.findDoctorsByCriteria(name, gender, specialtyId);
        List<DoctorDTO> doctorDTOList = new ArrayList<>();
        for (Doctor doctor : doctorList){
            DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor);
            doctorDTOList.add(doctorDTO);
        }
        response.setStatusCode(200);
        response.setDoctorList(doctorDTOList);
        response.setTotal(doctorDTOList.size());
        return response;
    }

    @Override
    public Response getDoctorById(DoctorDTO doctorRequest) {
        Response response = new Response();
        long id = doctorRequest.getId();
        var doctor =  doctorRepository.findById(id);
        DoctorDTO doctorDTO = Utils.mapDoctorEntityToDoctorDTO(doctor.get());
        response.setStatusCode(200);
        response.setDoctor(doctorDTO);
        return response;
    }

    @Override
    public Response getAllReviewDoctor(DoctorDTO doctorRequest) {
        Response response = new Response();
        long id = doctorRequest.getId();
        List<Comment> commentList = commentRepository.findByDoctorId(id);
        List<CommentDTO> commentDTOList = Utils.mapCommentListEntityToCommentListDTO(commentList);
        response.setStatusCode(200);
        response.setCommentList(commentDTOList);
        return response;
    }
}
