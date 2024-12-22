import { useEffect, useState } from 'react';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import PatientApiService from '../../../service/PatientApiService';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { DatePicker } from 'antd';
import swal from 'sweetalert';

const PatientInfor = ({ patientData, setPatientData, reason, setReason}) => {
    const { authChecked, data } = useAuthCheck();
    console.log("ttttt=>", data);
    const isAuthenticated = authApiService.isAuthenticated();
     const [isChange, setIsChange] = useState(''); 
        const { register, handleSubmit } = useForm({});
        const [userId, setUserId] = useState('');
        const [selectBloodGroup, setSelectBloodGroup] = useState('');
        const [selectedGender, setSelectedGender] = useState('');
        const [selectedImage, setSelectedImage] = useState(null);
        const [file, setFile] = useState(null);
        const [patient, setPatient] = useState(null);
        const [formData, setFormData] = useState({
            id: '',
            address: '',
            bloodGroup: '',
            city: '',
            country: '',
            dob: '',
            gender: '',
            ethnicity: '',
            job: '',
            workPlace: '',
            healthInsuranceNumber: '',
            user: {
                name: '',
                phone: '',
                id: '',
            },
        });
    const checkAuthAndSetData = async () => {
        if (isAuthenticated && data?.id) {
            try {
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                setPatientData(patientt.patient);
                console.log("ttttt=>", patientt.patient);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    // useEffect(() => {
    //     checkAuthAndSetData();
    // }, [authChecked, data, isAuthenticated]);

    console.log("ttinbn=>", patientData);

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
            if (name === 'bloodGroup') {
                setSelectBloodGroup(value);
            }
            if (name === 'gender') {
                setSelectedGender(value);
            }
    
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const onSubmit = async () => {
        selectedImage && formData.append('file', file);
        console.log("dataaa=>", formData)
        try {
            // Gọi API và đợi phản hồi
            const response = await PatientApiService.updatePatientInfo(formData);
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
        <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                            <label className='form-label'>Phân loại</label>
                            <select 
                                className="form-control select" 
                                onChange={(e) => hanldeOnChange(e, "gender")} 
                                name='gender' 
                                value={selectedGender}
                            >
                                <option value={''}>Chọn</option>
                                <option value="Nam" className='text-capitalize'>Đã có tài khoản</option>
                                <option value="Nữ" className='text-capitalize'>Bệnh nhân mới</option>
                            </select>
                        </div>
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
                            <label className='form-label'>Ngày sinh {moment(patient?.dob).format('DD/MM/YYYY')}</label>
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
                            <label>Số BHYT</label>
                            <input defaultValue={patient?.healthInsuranceNumber} {...register("healthInsuranceNumber")} className="form-control" onChange={(e) => hanldeOnChange(e, "healthInsuranceNumber")}/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group mb-2 card-label">
                            <label>Quốc gia</label>
                            <input defaultValue={patient?.country} {...register("country")} className="form-control" onChange={(e) => hanldeOnChange(e, "country")}/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group mb-2 card-label">
                            <label>Tỉnh/Thành phố</label>
                            <input defaultValue={patient?.city} {...register("city")} className="form-control" onChange={(e) => hanldeOnChange(e, "city")}/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group mb-2 card-label">
                            <label>Địa chỉ cư trú</label>
                            <input defaultValue={patient?.address} {...register("address")} className="form-control" onChange={(e) => hanldeOnChange(e, "address")}/>
                        </div>
                    </div>

                    
                    <div className='text-center'>
                        <button type="submit" className="btn btn-primary my-3" disabled={isChange ? false : true}>Lưu thông tin</button>
                    </div>
                </form>
    )
}

export default PatientInfor;