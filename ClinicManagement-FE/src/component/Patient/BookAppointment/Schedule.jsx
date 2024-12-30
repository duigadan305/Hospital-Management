import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./index.css";

const localizer = momentLocalizer(moment);

// Kiểm tra xung đột giữa các sự kiện
const overlapping = (a, b) => {
  return (
    (a.start >= b.start && a.start < b.end) ||
    (a.end > b.start && a.end <= b.end)
  );
};

// Kiểm tra và đánh dấu các khung giờ xung đột
const isOverlapping = (events) => {
  let conflicts = [];
  events.forEach((event1, index) => {
    events.forEach((event2) => {
      if (event1.id !== event2.id && overlapping(event1, event2)) {
        conflicts.push(event1.id);
      }
    });
  });

  return events.map((event) => ({
    ...event,
    color: conflicts.includes(event.id) ? "red" : "green",
  }));
};

const Schedule = ({ appointments, handleSlotChange }) => {
  const [events, setEvents] = useState([]); // Danh sách các sự kiện
  const [selectedSlot, setSelectedSlot] = useState(null); // Chỉ lưu 1 sự kiện đã chọn

  useEffect(() => {
    // Chuyển đổi `appointmentTime` thành `Date`
    const updatedEvents = appointments.map((appointment) => {
      const [datePart, timePart] = appointment.appointmentTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const formattedDate = `${year}-${month}-${day}T${timePart}`;
      return {
        id: appointment.id,
        start: new Date(formattedDate),
        end: new Date(formattedDate),
        title: appointment.title || "Cuộc hẹn",
        color: "green", // Màu mặc định là xanh
      };
    });

    setEvents(updatedEvents);
  }, [appointments]);

  const handleSelectSlot = (slotInfo) => {
    const { start } = slotInfo;

    // Không cần AM/PM, sử dụng thời gian 24 giờ
    handleSlotChange({
      start,
      end: new Date(start.getTime() + 30 * 60000), // Tăng 30 phút để tạo thời gian kết thúc
    });

    if (selectedSlot && selectedSlot.start.getTime() === start.getTime()) {
      // Nếu chọn lại khung giờ đã chọn, hủy chọn
      setSelectedSlot(null);
      setEvents(
        events.map((event) => ({
          ...event,
          color: "green", // Màu ban đầu
        }))
      );
    } else {
      const minutes = start.getMinutes();
      const startTime = new Date(start);
      startTime.setMinutes(minutes < 30 ? 0 : 30);
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 30);

      const newEvent = {
        id: "selectedSlot",
        start: startTime,
        end: endTime,
        title: "Thời gian đã chọn",
        color: "#ADD8E6", // Màu đã chọn
      };

      const updatedEvents = [
        ...events.filter((event) => event.id !== "selectedSlot"),
        newEvent,
      ];
      setEvents(updatedEvents);
      setSelectedSlot(newEvent);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        defaultView={Views.WEEK}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "6px",
          },
        })}
        selectable
        onSelectSlot={handleSelectSlot}
        popup
      />
      {selectedSlot && (
        <div className="selected-slot-info">
          <h3>Ngày giờ đã chọn:</h3>
          <p>{moment(selectedSlot.start).format("DD/MM/YYYY HH:mm")}</p>{" "}
          {/* Hiển thị 24 giờ */}
        </div>
      )}
    </div>
  );
};

export default Schedule;
