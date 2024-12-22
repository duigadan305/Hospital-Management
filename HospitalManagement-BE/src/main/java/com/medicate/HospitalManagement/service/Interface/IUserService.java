package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.GoogleLoginRequest;
import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.RegisterRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;

import java.util.List;

public interface IUserService {
    Response register(String token);
    Response register1(User loginRequest);
    Response confirmEmail(User user);

    Response login(LoginRequest loginRequest);

    Response sendOtp (String email);
//    Response getAllUsers();
//    Response getUserBookingHistory(String userId);
//    Response deleteUser(String userId);
    Response getUserById(String userId);
    Response getMyInfo(String userId);
    Response resetPassword(LoginRequest loginRequest);
    Response changePassword(String oldPass, String newPass);
    Response googleLogin(GoogleLoginRequest loginRequest);
}
