import React, { useState } from 'react'
import logo from '../../../images/logo1.png';
import userImg from '../../../images/avatar.jpg';
import './AdminHeader.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { message } from 'antd';
import authApiService from '../../../service/authApiService';
import { useNavigate } from 'react-router-dom';
import useAuthCheck from '../../../service/useAuthCheck';


const AdminHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { data } = useAuthCheck();
    const hanldeSignOut = () => {
        authApiService.logout();
        message.success("Successfully Logged Out")
        navigate('/login')
    }

    const toggleDropdown = () => setIsOpen(!isOpen);
    return (
        <div className="header">
            <div className="header-left">
                <a href="index.html" className="logo">
                    <img src={logo} alt="Logo" />
                </a>
            </div>

            <a id="toggle_btn">
                <i className="fe fe-text-align-left"></i>
            </a>

            {/* <div className="top-nav-search">
                <form>
                    <input type="text" className="form-control" placeholder="Search here" />
                    <button className="btn" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </div>

            <a className="mobile_btn" id="mobile_btn">
                <i className="fa fa-bars"></i>
            </a> */}
            <ul className="nav user-menu" style={{marginRight:'65px'}}>

                {/* <li className="nav-item dropdown noti-dropdown">
                    <a href="#" className="dropdown-toggle nav-link" onClick={toggleDropdown}>
                        <i className="fe fe-bell"></i> <span className="badge badge-pill">3</span>
                    </a>
                    <div className="dropdown-menu notifications">
                        hehe
                    </div>
                </li> */}
                <li className="nav-item dropdown has-arrow" style={{ position: "relative", display: "inline-block" }}>
                    <a href="#" className="dropdown-toggle nav-link" style={{marginLeft:'90px'}}>
                        <span className="user-img"><img className="rounded-circle" src={userImg} width="31" alt="" /></span>
                    </a>   

                        <ul className="dropdown-menu"
                        style={{
                            display: "none",
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            backgroundColor: "#fff",
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.15)",
                            listStyle: "none",
                            padding: "10px",
                            margin: "0",
                            zIndex: 1000,
                          }}>
                            <li className="user-header">
                                <div className="avatar avatar-sm">
                                    <img src={userImg} alt="" className="avatar-img rounded-circle" />
                                </div>
                                <div className="user-text">
                                    <h6>{data.name}</h6>
                                    <p className="text-muted mb-0">Quản trị viên</p>
                                </div>
                            </li>
                            <li><a className="dropdown-item" href="" onClick={hanldeSignOut}>Đăng xuất</a></li>
                        </ul>
                </li>

            </ul>

        </div>
    )
}

export default AdminHeader