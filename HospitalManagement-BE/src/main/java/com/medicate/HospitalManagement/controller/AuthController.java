package com.medicate.HospitalManagement.controller;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.medicate.HospitalManagement.dto.GoogleLoginRequest;
import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.RegisterRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private IUserService userService;

    @GetMapping("/register")
    public ResponseEntity<Response> register(@RequestParam("token") String token) {
        Response response = userService.register(token);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/register1")
    public ResponseEntity<Response> register1(@RequestBody User user) {
        Response response = userService.register1(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<Response> forgotPassword(@RequestBody LoginRequest loginRequest) {
        Response response = userService.sendOtp(loginRequest.getEmail());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @PostMapping("/resetPassword")
    public ResponseEntity<Response> resetPassword(@RequestBody LoginRequest loginRequest) {
        Response response = userService.resetPassword(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/findUserByEmail/{email}")
    public ResponseEntity<Response> getUserByEmail(@PathVariable("email") String email) {
        Response response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/register-confirm")
    public ResponseEntity<Response> registerConfirm(@RequestBody User user) {
        Response response = userService.confirmEmail(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/google-login")
    public ResponseEntity<Response> googleLogin(@RequestBody GoogleLoginRequest request) {
        Response response = userService.googleLogin(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }
}
