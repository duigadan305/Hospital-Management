import React, { useState } from "react";
import "./AdminSidebar.css";
import { FaHome, FaClipboardList, FaUser } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { FaPeopleArrows } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FaRegRectangleList } from "react-icons/fa6";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>Menu</span>
            </li>
            <li className={isActive("/admin/dashboard") ? "active" : ""}>
              <Link to={"/admin/dashboard"}>
                <FaHome /> <span>Trang chủ</span>
              </Link>
            </li>
            <li className={isActive("/admin/appointments") ? "active" : ""}>
              <Link to={"/admin/appointments"}>
                <FaUserAstronaut /> <span>Bệnh nhân</span>
              </Link>
            </li>
            <li className="submenu">
              <a href="#" onClick={() => setIsOpen(!isOpen)}>
                <FaPeopleArrows /> <span>Quản lý danh mục</span>{" "}
                <span className="">▾</span>
              </a>
              <ul className={isOpen ? "open" : ""}>
                <li className={isActive("/admin/specialities") ? "active" : ""}>
                  <Link to={"/admin/specialities"}>
                    <FaPeopleArrows /> <span>Chuyên khoa</span>
                  </Link>
                </li>
                <li className={isActive("/admin/services") ? "active" : ""}>
                  <Link to={"/admin/services"}>
                    <FaClipboardList /> <span>Dịch vụ</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="submenu">
              <a href="#" onClick={() => setIsOpen1(!isOpen1)}>
                <FaUser /> <span>Quản lý người dùng</span>{" "}
                <span className="">▾</span>
              </a>
              <ul className={isOpen1 ? "open" : ""}>
                <li className={isActive("/admin/user") ? "active" : ""}>
                  <Link to={"/admin/user"}>
                    <FaRegUser /> <span>Tài khoản</span>
                  </Link>
                </li>
                <li className={isActive("/admin/profile-info") ? "active" : ""}>
                  <Link to={"/admin/profile-info"}>
                    <FaUserAstronaut /> <span>Thông tin cá nhân</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className={isActive("/admin/reviews") ? "active" : ""}>
              <Link to={"/admin/reviews"}>
                <FaRegStar /> <span>Bình luận</span>
              </Link>
            </li>
            <li className={isActive("/admin/transaction") ? "active" : ""}>
              <Link to={"/admin/transaction"}>
                <FaBriefcase />
                <span>Giao dịch</span>
              </Link>
            </li>
            <li className={isActive("/admin/profile") ? "active" : ""}>
              <Link to={"/admin/profile"}>
                <FaRegUser /> <span>Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
