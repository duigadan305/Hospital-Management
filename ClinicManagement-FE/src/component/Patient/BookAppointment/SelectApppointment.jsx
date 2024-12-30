import moment from "moment";
import "./index.css";
import {
  FaBriefcase,
  FaRegClock,
  FaLocationArrow,
  FaLink,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CategoryApiService from "../../../service/CategoryApiService";
import Schedule from "./Schedule";
import DoctorApiService from "../../../service/DoctorApiService";

const SelectApppointment = ({
  selectTime,
  setSelectTime,
  selectedDoctor,
  setSelectedDoctor,
  doctorId,
}) => {
  const handleSelectTime = (date) => {
    setSelectTime(date);
  };
  const [doctorSpecialistOptions, setDoctorSpecialistOptions] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // Lưu slot đã chọn
  const [doctorData, setDoctorData] = useState({});

  useEffect(() => {
    const fetchSpecialties = async () => {
      const doctorRequest = {
        specialty: { id: selectedSpecialty || undefined },
      };
      try {
        const specialties = await CategoryApiService.getAllSpecialty();
        const data = await CategoryApiService.getAllDoctors(doctorRequest);
        if (doctorId) {
          const drequest = { id: doctorId };
          const data1 = await CategoryApiService.getDoctorById(drequest);
          setDoctorData(data1.doctor);
          setSelectedSpecialty(data1.doctor.specialty.id);
        }
        setDoctorsData(data.doctorList);
        // Chuyển dữ liệu thành dạng phù hợp cho Radio.Group
        const options = specialties.map((specialty) => ({
          label: specialty.name,
          value: specialty.id,
        }));
        setDoctorSpecialistOptions(options);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value); // Cập nhật chuyên khoa đã chọn
  };

  // Sử dụng useEffect để cập nhật danh sách bác sĩ khi selectedSpecialty thay đổi
  useEffect(() => {
    if (selectedSpecialty) {
      const filtered = doctorsData.filter(
        (item) => item.specialty.id === Number(selectedSpecialty)
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]); // Reset danh sách bác sĩ khi chưa chọn chuyên khoa
    }
  }, [selectedSpecialty]);

  const handleDoctorChange = (e) => setSelectedDoctor(e.target.value);

  useEffect(() => {
    const fetchAppointment = async () => {
      const appointmentRequest = {
        doctor: { id: selectedDoctor || undefined },
      };
      try {
        if (selectedDoctor) {
          console.log("idsi==>", selectedDoctor);
          const data = await DoctorApiService.getAppointmentByDoctorID(
            appointmentRequest
          );
          setAppointmentData(data.appointmentList);
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    fetchAppointment();
  }, [selectedDoctor]);

  console.log("henjnnn=>", appointmentData);

  const handleSlotChange = (newSlot) => {
    setSelectedSlot(newSlot); // Cập nhật slot đã chọn
    setSelectTime(moment(newSlot.start).format("DD/MM/YYYY HH:mm")); // Cập nhật thời gian cho AppointmentPage
  };

  return (
    <div style={{ marginTop: "5rem" }}>
      <dir className="p-3" style={{ background: "#f8f9fa" }}>
        <div className="row">
          <div className="col-md-2 col-sm-12 mt-3 info-part border-end">
            <p className="py-2 border-bottom info-head-date">
              Bạn muốn đặt lịch hẹn? Hãy chọn thời gian phù hợp
            </p>
            <div className="icon-box">
              <div className="d-flex gap-3">
                <FaBriefcase className="icon" />
                <p>Bác sĩ khám chữa bệnh</p>
              </div>
              <div className="d-flex gap-3">
                <FaRegClock className="icon" />
                <p>30 phút</p>
              </div>
              <div className="d-flex gap-3">
                <FaLocationArrow className="icon" />
                <p>
                  Phòng khám ...
                  <br />
                  <span className="form-text">Hà Nội, Việt Nam</span>
                </p>
              </div>
              <div className="d-flex gap-3">
                <FaLink className="icon" />
                <p>Khám trực tiếp</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 mt-3 border-end">
            <p className="py-2 border-bottom info-head-date">
              Chọn thông tin bác sĩ
            </p>
            <div className="info-date-card row">
              <div className="col-12 mb-3 specialty-box">
                <label htmlFor="specialty" className="form-label">
                  Chọn chuyên khoa
                </label>
                <select
                  id="specialty"
                  className="form-select"
                  onChange={handleSpecialtyChange}
                  value={selectedSpecialty}
                >
                  <option value="">Chọn chuyên khoa</option>
                  {doctorSpecialistOptions.map((specialty) => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 doctor-box">
                <label htmlFor="doctor" className="form-label">
                  Chọn bác sĩ
                </label>
                <select
                  id="doctor"
                  className="form-select"
                  disabled={!selectedSpecialty}
                  onChange={handleDoctorChange}
                  value={doctorData.id}
                >
                  <option value="">Chọn bác sĩ</option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Chọn thời gian - Bảng thời gian biểu */}
          <div className="col-md-7 col-sm-12 mt-3">
            <p className="py-2 border-bottom info-head-date">Chọn thời gian</p>
            <Schedule
              appointments={appointmentData}
              handleSlotChange={handleSlotChange}
            />
          </div>
        </div>
      </dir>
    </div>
  );
};

export default SelectApppointment;
