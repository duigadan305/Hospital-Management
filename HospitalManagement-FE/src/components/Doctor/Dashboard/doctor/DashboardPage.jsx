import React, { useEffect, useState } from 'react'
import img from '../../../../images/avatar.jpg';
import { FaEye, FaCheck, FaTimes, FaBriefcaseMedical } from "react-icons/fa";
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentMutation } from '../../../../redux/api/appointmentApi';
import moment from 'moment';
import { Button, Tag, message } from 'antd';
import CustomTable from '../../../UI/component/CustomTable';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import useAuthCheck from '../../../../redux/hooks/useAuthCheck'; 
import authApiService from '../../../../service/authApiService';
import DoctorApiService from '../../../../service/DoctorApiService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

const DashboardPage = () => {
    dayjs.extend(customParseFormat);
    dayjs.extend(isSameOrAfter);
    const [sortBy, setSortBy] = useState("upcoming");
    const { dataa, refetch, isLoading } = useGetDoctorAppointmentsQuery({ sortBy });
    const [updateAppointment, { isError, isSuccess, error }] = useUpdateAppointmentMutation();

    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const [appointmentData, setAppointmentData] = useState([]);
    const [todayAppointment, setTodayAppointment] = useState([]);
    const [upcomingAppointment, setUpcomingAppointment] = useState([]);
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
    }, [authChecked, data, isAuthenticated]);

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
                 // Xử lý lọc và sắp xếp
                 const today = dayjs().startOf('day');
                 const tomorrow = dayjs().add(1, 'day').startOf('day');
 
                 // Lọc danh sách cuộc hẹn hôm nay
                const todayAppointments = data.appointmentList
                .filter(app => 
                dayjs(app.appointmentTime, 'DD/MM/YYYY hh:mm A').isSame(today, 'day') // Kiểm tra ngày hôm nay
                )
                .sort((a, b) => 
                dayjs(a.appointmentTime, 'DD/MM/YYYY hh:mm A').diff(dayjs(b.appointmentTime, 'DD/MM/YYYY hh:mm A')) // Sắp xếp theo thời gian
                );

                // Lọc danh sách cuộc hẹn tương lai (từ ngày mai trở đi)
                const upcomingAppointments = data.appointmentList
                .filter(app => 
                dayjs(app.appointmentTime, 'DD/MM/YYYY hh:mm A').isSameOrAfter(tomorrow, 'day') // Kiểm tra ngày >= ngày mai
                )
                .sort((a, b) => 
                dayjs(a.appointmentTime, 'DD/MM/YYYY hh:mm A').diff(dayjs(b.appointmentTime, 'DD/MM/YYYY hh:mm A')) // Sắp xếp theo thời gian
                );
 
                 // Cập nhật state
                 setTodayAppointment(todayAppointments);
                 setUpcomingAppointment(upcomingAppointments);
            }
          } catch (error) {
            console.error("Error fetching appointment:", error);
          }
        };
    
        fetchAppointment();
      }, [doctorData]);

    console.log("todayy=>", todayAppointment);
    console.log("upcomingg=>", upcomingAppointment);

    const handleOnselect = (value) => {
        // eslint-disable-next-line eqeqeq
        setSortBy(value == 1 ? 'upcoming' : value == 2 ? 'today' : sortBy)
        refetch()
    }

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
                    doctor: { id: doctorData?.id || undefined }
                };
                const apdata = await DoctorApiService.getAppointmentByDoctorID(appointmentRequest);
                setAppointmentData(apdata.appointmentList);
            } else {
                console.log("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            message.success("Succcessfully Appointment Updated")
        }
        if (isError) {
            message.error(error?.data?.message);
        }
    }, [isSuccess, isError, error])

    const upcomingColumns = [
        {
            title: 'Bệnh nhân',
            key: '1',
            width: 100,
            render: function (appointmentData) {
                const fullName = `${appointmentData?.patient?.user?.name ?? ''}`;
                const imgdata = data?.patient?.img ? data?.patient?.img : img
                return <>
                    <div className="table-avatar">
                        <a className="avatar avatar-sm mr-2 d-flex gap-2">
                            <img className="avatar-img rounded-circle" src={imgdata} alt="" />
                            <div>
                                <p style={{ textAlign: 'left' }} className='p-0 m-0 text-nowrap'>
                                    {fullName}
                                </p>
                                <p style={{ textAlign: 'left' }} className='p-0 m-0'>{appointmentData?.patient?.user?.email}</p>
                            </div>
                        </a>
                    </div>
                </>
            }
        },
        {
            title: 'Thời gian khám',
            key: '2',
            width: 100,
            render: function (appointmentData) {
                return (
                    <div style={{ textAlign: 'left' }}>{appointmentData.appointmentTime}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            key: '4',
            width: 100,
            render: function (appointmentData) {
                return (
                    <div style={{ textAlign: 'left' }}>
                        <Tag color="#87d068" className='text-uppercase'>
                            {appointmentData?.status === "Pending" ? "Tiếp nhận" : (appointmentData?.status === "Accepted" ? "Chấp nhận": "Từ chối")}
                        </Tag>
                    </div>
                )
            }
        },
        {
            title: 'Dạng khám',
            key: '4',
            width: 100,
            render: function (appointmentData) {
                return (
                    <div style={{ textAlign: 'left' }}>
                        <Tag color="#87d068" className='text-uppercase'>{appointmentData?.type === "First" ? "Khám mới" : "Tái khám"}</Tag>
                    </div>
                )
            }
        },
        {
            title: 'Tác vụ',
            key: '5',
            width: 100,
            render: function (appointmentData) {
                return (
                    <div className='d-flex gap-2'>
                            <Link to={`/dashboard/prescription/${appointmentData?.id}`}>
                                <Button type="primary" shape="circle" icon={<FaEye />} size="small" />
                            </Link>
                        {
                            appointmentData.status === 'Accepted'
                                &&
                                <Link to={`/dashboard/appointment/treatment/${appointmentData?.id}`}>
                                    <Button type="primary" icon={<FaBriefcaseMedical />} size="small">Treatment</Button>
                                </Link>

                        }
                        {
                            appointmentData?.status === 'Pending' &&
                            <>
                                <Button type="primary" icon={<FaCheck />} size="small" onClick={() => updatedApppointmentStatus(appointmentData, 'Accepted')}>Accept</Button>
                                <Button type='primary' icon={<FaTimes />} size='small' danger onClick={() => updatedApppointmentStatus(appointmentData, 'Cancel')}>Cancel</Button>
                            </>
                        }
                    </div>
                )
            }
        },
    ];

    const items = [
        {
            key: '1',
            label: 'Hôm nay',
            children: <CustomTable
                loading={isLoading}
                columns={upcomingColumns}
                dataSource={todayAppointment}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
        {
            key: '2',
            label: 'Sắp tới',
            children: <CustomTable
                loading={isLoading}
                columns={upcomingColumns}
                dataSource={upcomingAppointment}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={handleOnselect} />
    )
}

export default DashboardPage;