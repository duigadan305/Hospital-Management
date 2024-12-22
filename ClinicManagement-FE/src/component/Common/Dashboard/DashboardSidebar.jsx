import React, { useState, useEffect } from 'react';
// import img from '../../images/avatar.jpg';
import './DashboardSidebar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthCheck from '../../../service/useAuthCheck';
import PatientApiService from '../../../service/PatientApiService';
import {
    FaTable,    
    FaUserInjured,
    FaRegStar, FaUserCog,
    FaHourglassStart,
    FaSignOutAlt,
    FaLock,
    FaHouseUser,
    FaEnvelope,
    FaFileInvoice
} from "react-icons/fa";
import DoctorApiService from '../../../service/DoctorApiService';
import { FaFileLines } from 'react-icons/fa6';
import authApiService from '../../../service/authApiService';
import { message } from 'antd';

const DashboardSidebar = () => {
    const { data, role } = useAuthCheck();
    const [patientData, setPatientData] = useState({});
    const [doctorData, setDoctorData] = useState({});
    const navigate = useNavigate();
    const checkAuthAndSetData = async () => {
        if (role == "USER"&&data) {
            try {
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                setPatientData(patientt.patient);
                console.log("ttttt=>", patientt.patient);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
        if (role == "DOCTOR"&&data) {
            try {
                const dataa = await DoctorApiService.getDoctorByEmail(data.email);
                setDoctorData(dataa.doctor);
                console.log("ttttt=>", dataa.doctor);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    useEffect(() => {
        checkAuthAndSetData();
    }, [data, role]);

    const hanldeSignOut = () => {
        authApiService.logout();
        message.success("Successfully Logged Out")
        navigate('/login')
    }

    return (
        <div className="profile-sidebar p-3 rounded">
            <div className="p-2 text-center border-bottom">
                {
                    role === 'DOCTOR' ?
                        <div className="profile-info text-center">
                          
                            <div className='profile-details'>
                                <h5 className='mb-0'>{data?.name}</h5>
                                <div>
                                    <p className="mb-0">{data?.email}</p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="profile-info text-center">
                            <div className='profile-details'>
                                <h5 className='mb-0'>{data?.name}</h5>
                                <div className='mt-2'>
                                    <p className=' form-text m-0'>{data?.email}</p>
                                </div>
                            </div>
                        </div>
                }

            </div>
            <nav className="dashboard-menu">
                {
                    role === 'USER' ?
                        (<ul>
                            <li>
                                <NavLink to={'/dashboard'} activeClassName="active" end>
                                    <FaTable className="icon" />
                                    <span>Lịch khám</span>
                                </NavLink>
                            </li>
                            { <li>
                                <NavLink to={`/patient-detail/${patientData?.id}`} activeClassName="active">
                                    <FaFileLines className="icon" />
                                    <span>Hồ sơ bệnh án</span>
                                </NavLink>
                            </li> }
                            <li>
                                <NavLink to={`/patient-invoice-detail/${patientData?.id}`} activeClassName="active">
                                    <FaFileInvoice className="icon" />
                                    <span>Hóa đơn</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/patient-comment/${patientData?.id}`} activeClassName="active">
                                    <FaEnvelope className="icon" />
                                    <span>Bình luận</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/patient-profile'} activeClassName="active">
                                    <FaUserCog className="icon" />
                                    <span>Thông tin cá nhân</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/change-password'} activeClassName="active">
                                    <FaLock className="icon" />
                                    <span>Đổi mật khẩu</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/login'} onClick={hanldeSignOut}>
                                    <FaSignOutAlt className="icon" end />
                                    <span>Đăng xuất</span>
                                </NavLink>
                            </li>
                        </ul>)
                        : role === 'STAFF' ? (
                            <ul>
                                <li>
                                    <NavLink to={'/dashboard'} activeClassName="active" end>
                                        <FaTable className="icon" />
                                        <span>Lịch khám</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/dashboard/invoices'} activeClassName="active" end>
                                        <FaHourglassStart className="icon" />
                                        <span>Hóa đơn</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/dashboard/staff-profile'} activeClassName="active" end>
                                        <FaUserCog className="icon" />
                                        <span>Thông tin cá nhân</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/dashboard/change-password'} activeClassName="active" end>
                                        <FaLock className="icon" />
                                        <span>Đổi mật khẩu</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/login'} onClick={hanldeSignOut}>
                                        <FaSignOutAlt className="icon" end />
                                        <span>Đăng xuất</span>
                                    </NavLink>
                                </li>
                            </ul>
                        ) 
                        :
                        <ul>
                            <li>
                                <NavLink to={'/dashboard'} activeClassName="active" end>
                                    <FaTable className="icon" />
                                    <span>Lịch khám</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/my-patients'} activeClassName="active" end>
                                    <FaUserInjured className="icon" />
                                    <span>Bệnh nhân</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={`/dashboard/reviews/${doctorData.id}`} activeClassName="active" end>
                                    <FaRegStar className="icon" />
                                    <span>Đánh giá</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to={'/dashboard/doctor-profile'} activeClassName="active" end>
                                    <FaUserCog className="icon" />
                                    <span>Thông tin cá nhân</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard/change-password'} activeClassName="active" end>
                                    <FaLock className="icon" />
                                    <span>Đổi mật khẩu</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/login'} onClick={hanldeSignOut}>
                                    <FaSignOutAlt className="icon" end />
                                    <span>Đăng xuất</span>
                                </NavLink>
                            </li>
                        </ul>
                }
            </nav>
        </div>
    )
}
export default DashboardSidebar;