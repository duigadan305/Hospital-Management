import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { bloodGrupOptions } from '../../../constant/global';
import { useUpdatePatientMutation } from '../../../redux/api/patientApi';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import { message } from 'antd';
import ImageUpload from '../../UI/form/ImageUpload';
import pImage from '../../../images/avatar.jpg';
import { DatePicker } from 'antd';
import PatientApiService from '../../../service/PatientApiService';

const PatientProfileSetting = () => {
    const { data } = useAuthCheck();
    console.log("dataProfile===>", data);
    const { register, handleSubmit } = useForm({});
    const [userId, setUserId] = useState('');
    const [selectBloodGroup, setSelectBloodGroup] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectValue, setSelectValue] = useState({})
    const [updatePatient, { isSuccess, isError, error, isLoading }] = useUpdatePatientMutation();
    const [date, setDate] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [patient, setPatient] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        bloodGroup: '',
        city: '',
        country: '',
        dob: '',
        gender: '',
        phone: '',
        name: '',
        user: {
            name: '',
            phone: '',
            id: '',
        },
    });
    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await PatientApiService.getPatientByEmail(data.email);
                setPatient(response.patient); // Gán dữ liệu vào biến patient
                setFormData({
                    address: patient.address || '',
                    bloodGroup: patient.bloodGroup || '',
                    city: patient.city || '',
                    country: patient.country || '',
                    dob: patient.dob || '',
                    gender: patient.gender || '',
                    phone: patient.phone || '',
                    name: patient.name || '',
                    user: {
                        name: patient.user.name || '',
                        phone: patient.user.phone || '',
                        id: patient.user.id || ''
                    },
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin bệnh nhân:", error);
            }
        };

        fetchPatientInfo();
    }, [data.id]);
    console.log("patient==>",patient);
    const onChange = (date, dateString) => { 
        setDate(moment(dateString).format('YYYY-MM-DD'));
    };

    useEffect(() => {
        if (patient) {
            setUserId(data.id)
            setSelectBloodGroup(patient?.bloodGroup)
        }
    }, [patient]);

    useEffect(() => {
        if (patient?.gender) {
            setSelectedGender(patient.gender);
        }
    }, [patient]);

    useEffect(() => {
        if (!isLoading && isError) {
            message.error(error?.data?.message)
        }
        if (isSuccess) {
            message.success('Successfully Profile Updated')
        }
    }, [isLoading, isError, error, isSuccess])

    const handleChange = (e) => {
        setSelectValue({ ...selectValue, [e.target.name]: e.target.value })
        if (e.target.name === 'bloodGroup') {
            setSelectBloodGroup(e.target.value);
        }
        if (e.target.name === 'gender') {
            setSelectedGender(e.target.value);
        }
    }

    const hanldeOnChange = (e) => {
        let { name, value } = e.target;
        if (e.target.name === 'bloodGroup') {
            setSelectBloodGroup(e.target.value);
        }
        if (e.target.name === 'gender') {
            setSelectedGender(e.target.value);
        }
        setFormData({ ...formData, [name]: value });
    }

    console.log("formPatient==>",formData);

    const onSubmit = async () => {
        selectedImage && formData.append('file', file);
        console.log("dataaa=>", formData)
        try {
            // Gọi API và đợi phản hồi
            const response = await PatientApiService.updatePatientInfo(formData);
    
            // Kiểm tra phản hồi
            if (response.status === 200) {
                console.log("Cập nhật thành công!", response.data);
            } else {
                console.log("Có lỗi xảy ra!", response);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
        }
    };

    return (
        <div style={{ marginBottom: '10rem' }}>
            <div className="w-100 mb-3 rounded mb-5 p-2" style={{ background: '#f8f9fa' }}>
                <h5 className="text-title mb-2 mt-3">Update Your Information</h5>
                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-12">
                        <div className="form-group">
                            <div className='change-avatar d-flex gap-2 align-items-center'>
                                <Link to={'/'} className="my-3 patient-img">
                                    <img src={selectedImage ? selectedImage : data?.img || pImage} alt="" />
                                </Link>
                                <div className="mt-3">
                                    <ImageUpload setSelectedImage={setSelectedImage} setFile={setFile}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Họ và tên<span className="text-danger">*</span></label>
                            <input defaultValue={data?.name} className="form-control" onChange={(e) => hanldeOnChange(e)} />
                        </div>
                    </div>                   
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Email <span className="text-danger">*</span></label>
                            <input defaultValue={data?.email} disabled className="form-control" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Ngày sinh {moment(patient?.dob).format('LL')}</label>
                            <DatePicker name='dob' onChange={(e) => hanldeOnChange(e)} format={"YYYY-MM-DD"} style={{ width: '100%', padding: '6px' }} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label className='form-label'>Số điện thoại</label>
                            <input defaultValue={data?.phone} {...register("phone")} className="form-control" onChange={(e) => hanldeOnChange(e)}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2">
                            <label className='form-label'>Giới tính</label>
                            <select 
                                className="form-control select" 
                                onChange={(e) => hanldeOnChange(e)} 
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

                    <div className="col-md-6">
                        <div className="form-group mb-2">
                            <label className='form-label'>Nhóm máu</label>
                            <select className="form-control select"
                                onChange={(e) => hanldeOnChange(e)}
                                name='bloodGroup'
                                value={selectBloodGroup}
                            >
                                <option value={''}>Chọn</option>
                                {
                                    bloodGrupOptions.map((option, index) => (
                                        <option key={index} value={option.value} className='text-capitalize'>{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Quốc gia</label>
                            <input defaultValue={patient?.country} {...register("country")} className="form-control" onChange={(e) => hanldeOnChange(e)}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Tỉnh/Thành phố</label>
                            <input defaultValue={patient?.city} {...register("city")} className="form-control" onChange={(e) => hanldeOnChange(e)}/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Địa chỉ</label>
                            <input defaultValue={patient?.address} {...register("address")} className="form-control" onChange={(e) => hanldeOnChange(e)}/>
                        </div>
                    </div>
                    <div className='text-center'>
                        <button type="submit" className="btn btn-primary my-3" disabled={isLoading ? true : false}>{isLoading ? 'Updating..' : 'Cập nhật thông tin'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PatientProfileSetting