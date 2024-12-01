package com.medicate.HospitalManagement.controller;


import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private IUserService userService;



    @GetMapping("/getById/{userId}")
    public ResponseEntity<Response> getUserById(@PathVariable("userId") String userId) {
        Response response = userService.getUserById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /*@DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteUSer(@PathVariable("userId") String userId) {
        Response response = userService.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/

    @GetMapping("/getLoggedInProfileInfo")
    public ResponseEntity<Response> getLoggedInUserProfile() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Response response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

   /* @GetMapping("/getUserBookings/{userId}")
    public ResponseEntity<Response> getUserBookingHistory(@PathVariable("userId") String userId) {
        Response response = userService.getUserBookingHistory(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/

    @GetMapping("/getUserByEmail/{email}")
    public ResponseEntity<Response> getUserByEmail(@PathVariable("email") String email) {
        Response response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<Response> changePassword(@RequestParam(value = "oldPass", required = false) String oldPass,
                                                   @RequestParam(value = "newPass", required = false) String newPass) {
        Response response = userService.changePassword(oldPass, newPass);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
