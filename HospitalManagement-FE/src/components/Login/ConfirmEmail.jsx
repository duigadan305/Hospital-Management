// ConfirmEmail.jsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ConfirmEmail = () => {
    const location = useLocation(); // Lấy thông tin location

    // Lấy token từ search params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/auth/register?token=${token}`);
                alert(response.data); // Hiển thị thông báo cho người dùng
                window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
            } catch (error) {
                alert(error.response.data || "An error occurred during confirmation.");
                window.location.href = '/login'; // Điều hướng về trang đăng nhập nếu có lỗi
            }
        };

        if (token) {
            confirmEmail();
        } else {
            alert("Invalid confirmation link.");
            window.location.href = '/login'; // Nếu không có token, điều hướng về trang đăng nhập
        }
    }, [token]);

    return <div>Loading...</div>; // Hiển thị thông báo loading hoặc spinner
};

export default ConfirmEmail;
