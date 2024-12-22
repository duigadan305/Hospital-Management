import { Link, NavLink } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Drawer, Button, Popover } from 'antd';
import './index.css';
import { FaBars, FaBell } from "react-icons/fa";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const HeaderNav = ({ open, setOpen, isLoggedIn, data, avatar, content }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const email = data?.email?.split('@')[0];

    // Cấu hình WebSocket
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("loooo=>", email);
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // URL của server WebSocket
            connectHeaders: {Authorization: `Bearer ${token}`, },
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);
                client.subscribe(`/topic/${email}-notification`, (message) => {
                    const newNotification = message.body;
                    setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
                    setUnreadCount((prevCount) => prevCount + 1);
                });
            },
            onError: (err) => {
                console.error('WebSocket error:', err);
            },
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        });

        client.activate();

        // Cleanup khi component unmount
        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, [notifications]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpenNoti(false);
    };

    const handleClickBell = () => {
        setUnreadCount(0); // Đánh dấu tất cả thông báo là đã đọc khi người dùng mở danh sách thông báo
        setOpenNoti(!openNoti);
    };
    console.log("notiii=>", notifications);
    return (
        <>
            <nav id="navbar" className="navbar order-last order-lg-0">
                <ul>
                    {(Object.keys(data).length === 0 || data.role === "USER") && (
                        <li>
                            <NavLink to={'/'} className={({ isActive }) => (isActive ? "nav-link scrollto active" : "")}>
                                Trang chủ
                            </NavLink>
                        </li>
                    )}
                    {(Object.keys(data).length === 0 || data.role === "USER") && (
                        <li>
                            <NavLink to={'/doctors'} className={({ isActive }) => (isActive ? "nav-link scrollto active" : "")}>
                                Bác sĩ
                            </NavLink>
                        </li>
                    )}
                    {(Object.keys(data).length === 0 || data.role === "USER") && (
                        <li>
                            <NavLink to={'/contact'} className={({ isActive }) => (isActive ? "nav-link scrollto active" : "")}>
                                Liên hệ
                            </NavLink>
                        </li>
                    )}
                    {!isLoggedIn && (
                        <li>
                            <Link to={'/login'} className="nav-link scrollto">Đăng nhập</Link>
                        </li>
                    )}
                </ul>

                {isLoggedIn && (
                    <div className="profile-section" style={{display:'flex'}}>
                       
                        {/* Thêm chuông thông báo */}
                        <div className="notification-bell" style={{ position: 'relative' }}>
                            <FaBell
                                className="notification-icon"
                                onClick={handleClickBell}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    color: unreadCount > 0 ? '#f5222d' : '#000',
                                }}
                            />
                            {unreadCount > 0 && (
                                <span
                                    className="notification-count"
                                    style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: '#f5222d',
                                        color: '#fff',
                                        fontSize: '12px',
                                        padding: '2px 6px',
                                        borderRadius: '50%',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                            {/* Hộp thoại thông báo */}
                            <Drawer
                                placement="right"
                                width={350}
                                onClose={onClose}
                                open={openNoti}
                                size="default"
                                title="Thông báo"
                            >
                                {notifications.length > 0 ? (
                                    <ul className="notification-list" style={{ padding: '0', listStyle: 'none' }}>
                                        {notifications.map((notif, index) => (
                                            <li
                                                key={index}
                                                className="notification-item"
                                                style={{
                                                    padding: '10px 15px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    cursor: 'pointer',
                                                }}
                                                // onClick={() => handleNotificationClick(notif)}
                                            >
                                                {notif}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ textAlign: 'center', margin: '20px 0', color: '#aaa' }}>
                                        Không có thông báo mới.
                                    </p>
                                )}
                            </Drawer>
                        </div>
                        <Popover content={content}>
                            <div className="profileImage">
                                <img src={data?.img ? data?.img : avatar} alt="" className="profileImage shadow img-fluid" />
                            </div>
                        </Popover>
                    </div>
                )}

                <FaBars className="mobile-nav-toggle" onClick={showDrawer} />
            </nav>
        </>
    );
};

export default HeaderNav