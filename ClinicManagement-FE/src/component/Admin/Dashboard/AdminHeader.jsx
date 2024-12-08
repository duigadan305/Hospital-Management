import React, { useState } from 'react'
import logo from '../../../images/logo1.png';
import userImg from '../../../images/avatar.jpg';
import './AdminHeader.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const AdminHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

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

            <div className="top-nav-search">
                <form>
                    <input type="text" className="form-control" placeholder="Search here" />
                    <button className="btn" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </div>

            <a className="mobile_btn" id="mobile_btn">
                <i className="fa fa-bars"></i>
            </a>
            <ul className="nav user-menu" style={{marginRight:'65px'}}>

                <li className="nav-item dropdown noti-dropdown">
                    <a href="#" className="dropdown-toggle nav-link" onClick={toggleDropdown}>
                        <i className="fe fe-bell"></i> <span className="badge badge-pill">3</span>
                    </a>
                    <div className="dropdown-menu notifications">
                        hehe
                    </div>
                </li>
                <li className="nav-item dropdown has-arrow">
                    <a href="#" className="dropdown-toggle nav-link" onClick={toggleDropdown} style={{marginLeft:'90px'}}>
                        <span className="user-img"><img className="rounded-circle" src={userImg} width="31" alt="Ryan Taylor" /></span>
                    </a>
                    {isOpen && (
                        <ul className="dropdown-menu show">
                            <li className="user-header">
                                <div className="avatar avatar-sm">
                                    <img src={userImg} alt="" className="avatar-img rounded-circle" />
                                </div>
                                <div className="user-text">
                                    <h6>Ryan Taylor</h6>
                                    <p className="text-muted mb-0">Quản trị viên</p>
                                </div>
                            </li>
                            <li><a className="dropdown-item" href="profile.html">Thông tin cá nhân</a></li>
                            <li><a className="dropdown-item" href="settings.html">Cài đặt</a></li>
                            <li><a className="dropdown-item" href="login.html">Đăng xuất</a></li>
                        </ul>
                    )}
                </li>

            </ul>

        </div>
    )
}

export default AdminHeader