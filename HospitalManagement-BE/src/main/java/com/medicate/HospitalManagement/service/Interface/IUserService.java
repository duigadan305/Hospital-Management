package com.medicate.HospitalManagement.service.Interface;


import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.RegisterRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.User;

public interface IUserService {
    Response register(User loginRequest);
    Response confirmEmail(RegisterRequest registerRequest);

    Response login(LoginRequest loginRequest);

    Response sendOtp (String email);
//    Response getAllUsers();
//    Response getUserBookingHistory(String userId);
//    Response deleteUser(String userId);
    Response getUserById(String userId);
    Response getMyInfo(String userId);
    Response resetPassword(LoginRequest loginRequest);
}
