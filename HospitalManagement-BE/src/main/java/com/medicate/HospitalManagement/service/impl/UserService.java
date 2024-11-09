package com.medicate.HospitalManagement.service.impl;


import com.medicate.HospitalManagement.dto.LoginRequest;
import com.medicate.HospitalManagement.dto.RegisterRequest;
import com.medicate.HospitalManagement.dto.Response;
import com.medicate.HospitalManagement.dto.UserDTO;
import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;
import com.medicate.HospitalManagement.exception.OurException;
import com.medicate.HospitalManagement.repo.PatientRepo;
import com.medicate.HospitalManagement.repo.SpecialtyRepo;
import com.medicate.HospitalManagement.repo.UserRepo;
import com.medicate.HospitalManagement.service.Interface.IUserService;
import com.medicate.HospitalManagement.utils.JWTUtils;
import com.medicate.HospitalManagement.utils.Utils;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private HttpSession httpSession; // Dùng để lưu trữ OTP vào session
    @Autowired
    private HttpServletResponse httpServletResponse;
    @Override
    public Response confirmEmail(User user) {
        Response response = new Response();
        try {
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException(user.getEmail() + "Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", user.getEmail());
            claims.put("password", user.getPassword());
            claims.put("name", user.getName());
            claims.put("phone", user.getPhone());
            var token = jwtUtils.generateRegisterToken(claims);
            String confirmationUrl = "http://localhost:4000/auth/register?token=" + token;
            sendEmailConfirm(user.getEmail(), confirmationUrl, "Confirm you email");
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
    public Response register(String token) {
        Response response = new Response();
        try {
            Claims claims = jwtUtils.decodeToken(token);
            String email = claims.get("email", String.class);
            String password = claims.get("password", String.class);
            String name = claims.get("name", String.class);
            String phone = claims.get("phone", String.class);
            User user = new User();


            if (userRepository.existsByEmail(email)) {
                throw new OurException(email + "Already Exists");
            }
            user.setEmail(email);
            user.setPassword(password);
            user.setName(name);
            user.setPhone(phone);
            user.setRole("USER");
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patientRepository.save(patient);
            response.setStatusCode(200);
            response.setUser(userDTO);
            httpServletResponse.sendRedirect("http://localhost:3000/login");
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
    public Response register1(User user) {
        Response response = new Response();
        try {
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException(user.getEmail() + "Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patientRepository.save(patient);
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

    /*@Override
    public Response register(User user) {
        Response response = new Response();
        try {
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException(user.getEmail() + "Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patientRepository.save(patient);
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
    }*/

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();

        try {
            String email = loginRequest.getEmail();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("user Not found"));

            var token = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole());
            response.setExpirationTime("7 Days");
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Login " + e.getMessage());
        }
        return response;
    }

   /* @Override
    public Response getAllUsers() {
        Response response = new Response();
        try {
            List<User> userList = userRepository.findAll();
            List<UserDTO> userDTOList = Utils.mapUserListEntityToUserListDTO(userList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUserList(userDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }*/

    /*@Override
    public Response getUserBookingHistory(String userId) {
        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }*/

    /*@Override
    public Response deleteUser(String userId) {
        Response response = new Response();

        try {
            userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            userRepository.deleteById(Long.valueOf(userId));
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
    }*/

    @Override
    public Response getUserById(String userId) {
        Response response = new Response();

        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

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
    public Response getMyInfo(String email) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

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
    public Response sendOtp(String email) {
        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);
            String otp = generateOtp(); // Hàm tạo OTP
            int expirationMinutes = 5;
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expirationMinutes); // 5 phút
            response.setOtp(otp);
            response.setExpiryTime(expiryTime);
            httpSession.setAttribute("otp", otp);
            httpSession.setAttribute("otpExpirationTime", expiryTime);
            // Gửi OTP qua email
            try {
                sendEmailWithOtp(email, otp, "sendOtp");  // Hàm gửi OTP qua email
            } catch (MailAuthenticationException e) {
                // Lỗi gửi email, báo cho người dùng và ghi log
                response.setStatusCode(500);
                response.setMessage("Failed to send OTP email: " + e.getMessage());
                return response;
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

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // OTP là số ngẫu nhiên từ 100000 đến 999999
        return String.valueOf(otp);
    }

    private void sendEmailWithOtp(String email, String content, String condition) {
        // Tạo email mới
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        if(condition.equals("sendOtp")){
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + content + "\nThis OTP will expire in 5 minutes.");
        } else if (condition.equals("confirmEmail")) {
            message.setSubject("Confirm your email");
            message.setText("Please click the link to confirm your registration:" + content + "\nThis notification will expire in 5 minutes.");
        }


        // Gửi email
        mailSender.send(message);
    }

    @Override
    public Response resetPassword(LoginRequest loginRequest) {
        Response response = new Response();

        try {
            String email = (String) loginRequest.getEmail();
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new OurException("user Not found"));
            String checkedOTP = (String) loginRequest.getCheckedOtp();
            String otp = (String) loginRequest.getOtp();
            LocalDateTime expiryTime = loginRequest.getExpiryTime();
            if (checkedOTP == null || expiryTime == null || !checkedOTP.equals(otp)) {
                throw new OurException("Invalid or expired OTP");
            }

            // Kiểm tra xem OTP đã hết hạn chưa
            if (LocalDateTime.now().isAfter(expiryTime)) {
                throw new OurException("OTP has expired");
            }
            user.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Login " + e.getMessage());
        }
        return response;
    }

    public void sendEmailConfirm(String to, String confirmationUrl, String subject) {
        // Sử dụng lớp SimpleMailMessage hoặc MimeMessageHelper để gửi email
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);

            // Tạo nội dung email với HTML
            String htmlContent = "<p>Dear user,</p>"
                    + "<p>Please click the link below to confirm your registration:</p>"
                    + "<a href=\"" + confirmationUrl + "\">Confirm your email</a>"
                    + "<p>If you did not request this, please ignore this email.</p>";

            // Set nội dung dưới dạng HTML
            helper.setText(htmlContent, true);  // 'true' cho phép gửi email với HTML

            // Gửi email
            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
            // Xử lý lỗi nếu có
        }
    }

}
