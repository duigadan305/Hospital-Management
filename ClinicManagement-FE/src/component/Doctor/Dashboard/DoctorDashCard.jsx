import './index.css';
import React, { useEffect, useState } from 'react';
import { FaHospitalUser, FaCalendarAlt, FaHospital } from "react-icons/fa";
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import DoctorApiService from '../../../service/DoctorApiService';

const DoctorDashCard = () => {

    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const [appointmentData, setAppointmentData] = useState([]);
    const [doctorData, setDoctorData] = useState({});
    
    console.log("vaodayyyy", data);
    const checkAuthAndSetData = async () => {
        if (isAuthenticated && data?.id) {
            try {
                const doctorr = await DoctorApiService.getDoctorByEmail(data.email);
                setDoctorData(doctorr.doctor);
                console.log("ttttt=>", doctorr.doctor);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    useEffect(() => {
        checkAuthAndSetData();
    }, [doctorData]);

    console.log("doccc=>", doctorData);

    useEffect(() => {
        const fetchAppointment = async () => {
          const appointmentRequest = {
              doctor: { id: doctorData?.id || undefined }
          };
          try {
            if(doctorData){
                console.log("iddoctorr==>", doctorData);
                const data = await DoctorApiService.getAppointmentByDoctorID(appointmentRequest);
                setAppointmentData(data.appointmentList);
            }
          } catch (error) {
            console.error("Error fetching appointment:", error);
          }
        };
    
        fetchAppointment();
        }, [doctorData]
    );
    
    const getUniquePatientsCount = (appointmentData) => {
        const uniquePatients = new Set(appointmentData.map((appt) => appt.patient.id));
        return uniquePatients.size;
    };
    
    const getTodayPatientsCount = (appointmentData) => {
        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = appointmentData.filter((appt) => {
          const appointmentDate = appt.appointmentTime.split(" ")[0]; // Lấy phần ngày
          const [day, month, year] = appointmentDate.split("/"); // Chuyển đổi định dạng
          const formattedDate = `${year}-${month}-${day}`;
          return formattedDate === today;
        });
        return getUniquePatientsCount(todayAppointments);
      };
    
    const todayDate = new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    
      const totalPatients = getUniquePatientsCount(appointmentData);
      const todayPatients = getTodayPatientsCount(appointmentData);
    
    const cardData = [
        {
            icon: <FaHospital className='icon' />,
            title: 'Tổng số bệnh nhân',
            amount: totalPatients,
            date: todayDate
        },
        {
            icon: <FaHospitalUser className='icon active' />,
            title: 'Số bệnh nhân hôm nay',
            amount: todayPatients,
            date: todayDate
        },
        {
            icon: <FaCalendarAlt className='icon danger' />,
            title: 'Lịch hẹn',
            amount: appointmentData.length,
            date: todayDate
        }
    ]
    return (

        <div className="row mb-4 p-3 rounded" style={{ background: '#f8f9fa' }}>
            {
                cardData.map((item, index) => (
                    <div className="col-md-12 col-lg-4" key={index + 8}>
                        <div className='d-flex gap-2 align-items-center dash-card'>
                            <div className='dash-card-icon'>
                                {item.icon}
                            </div>
                            <div className="dash-widget-info">
                                <h6 className='mb-0'>{item.title}</h6>
                                <h4 className='my-1'>{item.amount}</h4>
                                <p className="form-text">{item.date}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

    )
}
export default DoctorDashCard;