import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useForm } from 'react-hook-form';
import useAuthCheck from '../../../service/useAuthCheck';
import { DatePicker } from 'antd';
import swal from 'sweetalert';
import AdminApiService from '../../../service/AdminApiService';
import StaffApiService from '../../../service/StaffApiService';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';

const StaffProfileSetting = () => {
    const { data } = useAuthCheck();
    console.log("dataProfile===>", data);
    const [isChange, setIsChange] = useState(''); 
    const { register, handleSubmit } = useForm({});
    const [userId, setUserId] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        address: '',
        city: '',
        country: '',
        dob: '',
        gender: '',
        ethnicity: '',
        healthInsuranceNumber: '',
        user: {
            name: '',
            phone: '',
            id: '',
        },
    });
    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await StaffApiService.getStaffByEmail(data.email);
                setAdminData(response.employee); 
                const adminn = response.employee;
                setFormData({
                    id: adminn.id || '',
                    address: adminn.address || '',
                    city: adminn.city || '',
                    country: adminn.country || '',
                    dob: adminn.dob || '',
                    gender: adminn.gender || '',
                    ethnicity: adminn.ethnicity || '',
                    healthInsuranceNumber: adminn.healthInsuranceNumber || '',
                    user: {
                        name: adminn.user.name || '',
                        phone: adminn.user.phone || '',
                        id: adminn.user.id || ''
                    },
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
            }
        };

        fetchPatientInfo();
    }, [data.id]);
    // console.log("patient==>",patient);

    useEffect(() => {
        if (adminData) {
            setUserId(data.id)
        }
    }, [adminData]);

    useEffect(() => {
        if (adminData?.gender) {
            setSelectedGender(adminData.gender);
        }
    }, [adminData]);

    const hanldeOnChange = (e, fieldName) => {
        setIsChange('changed');
        setFormData(prevState => {
            // Trường hợp đặc biệt: DatePicker
            if (fieldName === 'dob') {
                return {
                    ...prevState,
                    dob: e?.format("YYYY-MM-DD") || null,
                };
            }
    
            // Trường hợp đặc biệt: Cập nhật 'user'
            if (['name', 'phone'].includes(fieldName)) {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user, // Giữ nguyên giá trị hiện tại
                        [fieldName]: e.target.value,
                    },
                };
            }
    
            // Các trường hợp còn lại
            const { name, value } = e.target;
    
            // Xử lý các trường đặc biệt như 'bloodGroup' hoặc 'gender'
            if (name === 'gender') {
                setSelectedGender(value);
            }
    
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    console.log("formPatient==>",formData);
    console.log("isChange==>",isChange);

    const onSubmit = async () => {
        selectedImage && formData.append('file', file);
        console.log("dataaa=>", formData)
        try {
            // Gọi API và đợi phản hồi
            const response = await AdminApiService.updateEmployeeInfor(formData);
            setIsChange('');
            // Kiểm tra phản hồi
            if (response.statusCode === 200) {
                swal({
                    icon: 'success',
                    text: `Cập nhật thông tin thành công!`,
                    timer: 2000
                });
            } else {
                console.log("Có lỗi xảy ra!", response);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
        }
    };

    return (
        <DashboardLayout>
        <div style={{ marginBottom: '10rem' }}>
            <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title mb-2 mt-3">Cập nhật thông tin cá nhân</h5>
                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    
                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Họ và tên<span className="text-danger">*</span></label>
                            <input defaultValue={data?.name} {...register("name")} className="form-control" onChange={(e) => hanldeOnChange(e, "name")} />
                        </div>
                    </div>                   
                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Email <span className="text-danger">*</span></label>
                            <input defaultValue={data?.email} disabled className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Số điện thoại</label>
                            <input defaultValue={data?.phone} {...register("phone")} className="form-control" onChange={(e) => hanldeOnChange(e, "phone")}/>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Ngày sinh {moment(adminData?.dob).format('DD/MM/YYYY')}</label>
                            <DatePicker {...register("dob")} onChange={(e) => hanldeOnChange(e, "dob")} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Giới tính</label>
                            <select 
                                className="form-control select" 
                                onChange={(e) => hanldeOnChange(e, "gender")} 
                                name='gender' 
                                value={selectedGender}
                            >
                                <option value={''}>Chọn</option>
                                <option value="Nam" className='text-capitalize'>Nam</option>
                                <option value="Nữ" className='text-capitalize'>Nữ</option>
                                <option value="Khác" className='text-capitalize'>Khác</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label>Dân tộc</label>
                            <input defaultValue={adminData?.ethnicity} {...register("ethnicity")} className="form-control" onChange={(e) => hanldeOnChange(e, "ethnicity")}/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group mb-2 card-label">
                            <label>Quốc gia</label>
                            <input defaultValue={adminData?.country} {...register("country")} className="form-control" onChange={(e) => hanldeOnChange(e, "country")}/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group mb-2 card-label">
                            <label>Tỉnh/Thành phố</label>
                            <input defaultValue={adminData?.city} {...register("city")} className="form-control" onChange={(e) => hanldeOnChange(e, "city")}/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Địa chỉ cư trú</label>
                            <input defaultValue={adminData?.address} {...register("address")} className="form-control" onChange={(e) => hanldeOnChange(e, "address")}/>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-2 card-label">
                            <label>Số BHYT</label>
                            <input defaultValue={adminData?.healthInsuranceNumber} {...register("healthInsuranceNumber")} className="form-control" onChange={(e) => hanldeOnChange(e, "healthInsuranceNumber")}/>
                        </div>
                    </div>
                    
                    <div className='text-center'>
                        <button type="submit" className="btn btn-primary my-3" disabled={isChange ? false : true}>Cập nhật thông tin</button>
                    </div>
                </form>
            </div>
        </div>
        </DashboardLayout>
    )
}

export default StaffProfileSetting