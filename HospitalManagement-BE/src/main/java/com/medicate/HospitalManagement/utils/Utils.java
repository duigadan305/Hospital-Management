package com.medicate.HospitalManagement.utils;

//import com.hotelbooking.KingHotel.DTO.BookingDTO;
//import com.hotelbooking.KingHotel.DTO.RoomDTO;
//import com.hotelbooking.KingHotel.DTO.UserDTO;
//import com.hotelbooking.KingHotel.Entity.Booking;
//import com.hotelbooking.KingHotel.Entity.Room;
//import com.hotelbooking.KingHotel.Entity.RoomImage;


import com.medicate.HospitalManagement.dto.DoctorDTO;
import com.medicate.HospitalManagement.dto.PatientDTO;
import com.medicate.HospitalManagement.dto.SpecialtyDTO;
import com.medicate.HospitalManagement.dto.UserDTO;
import com.medicate.HospitalManagement.entity.Doctor;
import com.medicate.HospitalManagement.entity.Patient;
import com.medicate.HospitalManagement.entity.Specialty;
import com.medicate.HospitalManagement.entity.User;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }


    public static UserDTO mapUserEntityToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static SpecialtyDTO mapSpecialtyEntityToSpecialtyDTO(Specialty specialty) {
        SpecialtyDTO specialtyDTO = new SpecialtyDTO();

        specialtyDTO.setId(specialty.getId());
        specialtyDTO.setName(specialty.getName());
        specialtyDTO.setDescription(specialty.getDescription());
        return specialtyDTO;
    }

    public static PatientDTO mapPatientEntityToPatientDTO(Patient patient) {
        PatientDTO patientDTO = new PatientDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(patient.getUser());
        patientDTO.setId(patient.getId());
        patientDTO.setName(patient.getUser().getName());
        patientDTO.setDob(patient.getDob());
        patientDTO.setGender(patient.getGender());
        patientDTO.setBloodGroup(patient.getBloodGroup());
        patientDTO.setCity(patient.getCity());
        patientDTO.setCountry(patient.getCountry());
        patientDTO.setAddress(patient.getAddress());

        patientDTO.setUser(userDTO);
        patientDTO.setBloodGroup(patient.getBloodGroup());
        return patientDTO;
    }

    public static DoctorDTO mapDoctorEntityToDoctorDTO(Doctor doctor) {
        DoctorDTO doctorDTO = new DoctorDTO();
        UserDTO userDTO = Utils.mapUserEntityToUserDTO(doctor.getUser());
        SpecialtyDTO specialtyDTO = Utils.mapSpecialtyEntityToSpecialtyDTO(doctor.getSpecialty());
        doctorDTO.setId(doctor.getId());
        doctorDTO.setDob(doctor.getDob());
        doctorDTO.setGender(doctor.getGender());
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        doctorDTO.setCity(doctor.getCity());
        doctorDTO.setCountry(doctor.getCountry());
        doctorDTO.setAddress(doctor.getAddress());
        doctorDTO.setSpecialty(specialtyDTO);
        doctorDTO.setUser(userDTO);
        doctorDTO.setBloodGroup(doctor.getBloodGroup());
        return doctorDTO;
    }



   /* public static RoomDTO mapRoomEntityToRoomDTO(Room room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setImageList(room.getRoomImages());
        List<String> base64Images = new ArrayList<>();
        for(RoomImage img : room.getRoomImages()){
             String base64Image = Base64.getEncoder().encodeToString(img.getContent());
             base64Images.add(base64Image);
        }
        roomDTO.setBase64Image(base64Images);
        roomDTO.setRoomDescription(room.getRoomDescription());
        return roomDTO;
    }*/

    /*public static BookingDTO mapBookingEntityToBookingDTO(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();
        // Map simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalGuest(booking.getTotalGuest());
        bookingDTO.setBookingConfirmCode(booking.getBookingConfirmCode());
        return bookingDTO;
    }*/

    /*public static RoomDTO mapRoomEntityToRoomDTOPlusBookings(Room room) {
        RoomDTO roomDTO = new RoomDTO();

        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setImageList(room.getRoomImages());
        roomDTO.setRoomDescription(room.getRoomDescription());

        if (room.getBookings() != null) {
            roomDTO.setBookings(room.getBookings().stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList()));
        }
        return roomDTO;
    }*/

    /*public static BookingDTO mapBookingEntityToBookingDTOPlusBookedRooms(Booking booking, boolean mapUser) {

        BookingDTO bookingDTO = new BookingDTO();
        // Map simple fields
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalGuest(booking.getTotalGuest());
        bookingDTO.setBookingConfirmCode(booking.getBookingConfirmCode());
        if (mapUser) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }
        if (booking.getRoom() != null) {
            RoomDTO roomDTO = new RoomDTO();

            roomDTO.setId(booking.getRoom().getId());
            roomDTO.setRoomType(booking.getRoom().getRoomType());
            roomDTO.setRoomPrice(booking.getRoom().getRoomPrice());
            roomDTO.setImageList(booking.getRoom().getRoomImages());
            roomDTO.setRoomDescription(booking.getRoom().getRoomDescription());
            bookingDTO.setRoom(roomDTO);
        }
        return bookingDTO;
    }*/

    /*public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole());

        if (!user.getBookings().isEmpty()) {
            userDTO.setBookings(user.getBookings().stream().map(booking -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, false)).collect(Collectors.toList()));
        }
        return userDTO;
    }*/


    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

   /* public static List<RoomDTO> mapRoomListEntityToRoomListDTO(List<Room> roomList) {
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).collect(Collectors.toList());
    }*/

    /*public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Booking> bookingList) {
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
    }*/

}
