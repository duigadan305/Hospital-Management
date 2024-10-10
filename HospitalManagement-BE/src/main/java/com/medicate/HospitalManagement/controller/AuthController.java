package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody User user) {
        Response response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/forgotPassword/{email}")
    public ResponseEntity<Response> forgotPassword(@PathVariable("email") String email) {
        Response response = userService.sendOtp(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}
