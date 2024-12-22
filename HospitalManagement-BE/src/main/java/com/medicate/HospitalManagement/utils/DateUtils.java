package com.medicate.HospitalManagement.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;

public class DateUtils {
    public static String normalizeAppointmentTime(String time) {
        // Xóa bỏ AM/PM nếu có và trả về chuỗi mới
        return time.replace(" AM", "").replace(" PM", "");
    }

    // Phân tích chuỗi sang LocalDateTime
    public static Optional<LocalDateTime> parseStringToDateTime(String time) {
        try {
            // Chuẩn hóa chuỗi
            String normalizedTime = normalizeAppointmentTime(time);

            // Định dạng ngày giờ
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            // Trả về LocalDateTime
            return Optional.of(LocalDateTime.parse(normalizedTime, formatter));
        } catch (DateTimeParseException e) {
            System.err.println("Lỗi: Không thể phân tích thời gian - " + time);
            return Optional.empty();
        }
    }
}

