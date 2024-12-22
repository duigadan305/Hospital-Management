import React, { useEffect, useState } from 'react';
import { Button, Tabs, Tag, Modal } from 'antd';
import CustomTable from '../../Common/UI/CustomTable';
import { Link } from 'react-router-dom';
import PatientApiService from '../../../service/PatientApiService';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import DoctorApiService from '../../../service/DoctorApiService';
import swal from 'sweetalert';

const PatientDashboard = () => {
    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const [appointmentData, setAppointmentData] = useState([]);
    const [patientData, setPatientData] = useState({});
    
    console.log("vaodayyyy", data);
    const checkAuthAndSetData = async () => {
        if (isAuthenticated && data?.id) {
            try {
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                setPatientData(patientt.patient);
                console.log("ttttt=>", patientt.patient);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    useEffect(() => {
        checkAuthAndSetData();
    }, [authChecked, data, isAuthenticated]);

    useEffect(() => {
        const fetchAppointment = async () => {
          const appointmentRequest = {
              patient: { id: patientData?.id || undefined }
          };
          try {
            if(patientData){
                console.log("idpatienttt==>", patientData);
                const data = await PatientApiService.getAllAppointment(appointmentRequest);
                setAppointmentData(data.appointmentList);
            }
          } catch (error) {
            console.error("Error fetching appointment:", error);
          }
        };
    
        fetchAppointment();
      }, [patientData]);

      const updatedApppointmentStatus = async (data, type) => {
        try {
            const apRequest = {
                id: data.id,
                status: type
            }
            // Gọi API và đợi phản hồi
            const response = await DoctorApiService.handleAppointment(apRequest);
    
            // Kiểm tra phản hồi
            if (response.statusCode === 200) {
                const appointmentRequest = {
                    patient: { id: patientData?.id || undefined }
                };
                const apdata = await PatientApiService.getAllAppointment(appointmentRequest);
                setAppointmentData(apdata.appointmentList);
                swal({
                    icon: 'success',
                    text: `Đã hủy lịch khám`,
                    timer: 2000
                });
            } else {
                console.log("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
        }
    };
    
    const showConfirmCancel = (appointmentData) => {
        Modal.confirm({
            title: 'Xác nhận hủy lịch hẹn',
            content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => updatedApppointmentStatus(appointmentData, 'Cancel'),
        });
    };

    console.log("henj=>", appointmentData);
    
    const appointmentColumns = [
        {
            title: 'Bác sĩ khám',
            // key: 20,
            width: 70,
            render: function (appointmentData) {
                return <>
                    <div className="avatar avatar-sm mr-2 d-flex gap-2">                     
                        <div>
                            <h6 className='text-nowrap mb-0'>{appointmentData?.doctor?.user?.name}</h6>
                            <p className='form-text'>{appointmentData?.doctor?.specialty?.name}</p>
                        </div>
                    </div>
                </>
            }
        },
        {
            title: 'Thời gian hẹn',
            // key: 22,
            width: 100,
            render: function (appointmentData) {
                return (
                    <div style={{ textAlign: 'left' }}>{appointmentData?.appointmentTime}</div>
                )
            }
        },
        {
            title: 'Lý do khám',
            // key: 23,
            width: 200,
            render: function (appointmentData) {
                return <div style={{ textAlign: 'left' }}>{appointmentData?.reason}</div>
            }
        },
        {
            title: 'Trạng thái',
            // key: 24,
            width: 50,
            render: function (appointmentData) {
                return <div style={{ textAlign: 'left' }}>
                <Tag 
                    color={
                        appointmentData?.status === "Pending" 
                        ? "#FFA500" // Màu cam cho "Chờ tiếp nhận"
                        : appointmentData?.status === "Accepted" 
                        ? "#008000" // Màu xanh lá cho "Chấp nhận"
                        : appointmentData?.status === "Pended" 
                        ? "#1E90FF" // Màu xanh dương cho "Tiếp nhận"
                        : appointmentData?.status === "Treated" 
                        ? "#6A5ACD" // Màu tím cho "Đã khám"
                        : "#FF0000" // Màu đỏ cho "Hủy"
                    }
                >
                    {appointmentData?.status === "Pending" 
                        ? "Chờ tiếp nhận" 
                        : appointmentData?.status === "Accepted" 
                        ? "Chấp nhận" 
                        : appointmentData?.status === "Pended" 
                        ? "Tiếp nhận" 
                        : appointmentData?.status === "Treated" 
                        ? "Đã khám"
                        : "Hủy"
                    }
                </Tag>

            </div>
            }
        },
        {
            title: 'Hành động',
            // key: 25,
            width: 70,
            render: function (appointmentData) {
                return (
                    <div style={{ display: 'flex', justifyContent:'space-between' }}>
                        
                        {(appointmentData?.status == 'Pending'||appointmentData?.status == 'Pended') &&<Button type='primary' style={{backgroundColor:'#FF0000'}} onClick={() => showConfirmCancel(appointmentData, 'Cancel')}>Hủy</Button>}
                        {(appointmentData?.status == 'Treated') &&
                         <Link 
                            to={`/medical-record/${appointmentData.id}`}
                            state={{ from: `/dashboard` }} 
                         >
                         <Button type="primary">Xem bệnh án</Button>
                     </Link>}
                    </div>
                    
                )
            }
        },
    ];

    const items = [
        {
            key: '1',
            label: 'Lịch sử hẹn khám',
            children: <CustomTable
                columns={appointmentColumns}
                dataSource={appointmentData}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
        
    ];
    return (
        <Tabs defaultActiveKey="1" items={items} />
    )
}
export default PatientDashboard;