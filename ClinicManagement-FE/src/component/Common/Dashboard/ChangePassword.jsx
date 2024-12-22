import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Button } from 'antd';
import useAuthCheck from '../../../service/useAuthCheck';
import PatientApiService from '../../../service/PatientApiService';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import authApiService from '../../../service/authApiService';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [reNewPass, setReNewPass] = useState("");
    const { authChecked, data } = useAuthCheck();
    // const checkAuthAndSetData = async () => {
    //     if (data?.id) {
    //         try {
    //             const patientt = await PatientApiService.getPatientByEmail(data.email);
    //             setPatientData(patientt.patient);
    //             console.log("ttttt=>", patientt.patient);
    //         } catch (error) {
    //             console.error("Error fetching patient:", error);
    //         }
    //     }
    // };
    // useEffect(() => {
    //     checkAuthAndSetData();
    // }, [authChecked, data, isAuthenticated]);

    const handleChangePass = async () => {
        if(newPass != reNewPass){
            swal({
                icon: 'error',
                text: `Xác nhận mật khẩu mới không khớp!`,
                timer: 2000
            });
        } else {
            try {
                const formData = new FormData();
                formData.append("oldPass", oldPass);
                formData.append("newPass", newPass);
                // Gọi API và đợi phản hồi
                const response = await PatientApiService.changePassword(formData);

                // Kiểm tra phản hồi
                if (response.statusCode === 200) {
                    swal({
                        icon: 'success',
                        text: `Đổi mật khẩu thành công!`,
                        timer: 2000
                    }).then(() => {
                        navigate('/login'); // Điều hướng về trang login
                        authApiService.logout();
                    });
                } else {
                    swal({
                        icon: 'error',
                        text: `${response.message}`,
                        timer: 2000
                    });
                }
            } catch (error) {
                swal({
                    icon: 'error',
                    text: `${error.response?.data?.message}`,
                    timer: 2000
                });
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="w-100 mb-3 rounded p-2" style={{ background: '#f8f9fa' }}>
                <h5 className='text-title mt-3'>Thay đổi mật khẩu</h5>
                <form className='container row form-row px-5 mx-auto my-5'>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>Mật khẩu hiện tại</label>
                            <input onChange={(e) => setOldPass(e.target.value)} type="password" placeholder='...' className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3 card-label">
                            <label>Mật khẩu mới</label>
                            <input onChange={(e) => setNewPass(e.target.value)} type="password" placeholder='...' className="form-control" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-2 card-label">
                            <label>Xác nhận mật khẩu</label>
                            <input onChange={(e) => setReNewPass(e.target.value)} type="password" placeholder='...' className="form-control" />
                        </div>
                    </div>
                    <div className='mt-5 text-center'>
                        <Button onClick={handleChangePass} type="primary" size='large'>Cập nhật</Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default ChangePassword;