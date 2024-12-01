import { useEffect, useState } from 'react';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import PatientApiService from '../../../service/PatientApiService';

const PersonalInformation = ({ patientData, setPatientData, reason, setReason}) => {
    const { authChecked, data } = useAuthCheck();
    console.log("ttttt=>", data);
    const isAuthenticated = authApiService.isAuthenticated();
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
    useEffect(() => {
        checkAuthAndSetData();
    }, [authChecked, data, isAuthenticated]);

    console.log("ttinbn=>", patientData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'reason'){
            setReason(value);
        }
    };


    return (
        <form className="rounded p-3 mt-5" style={{ background: "#f8f9fa" }}>
            <div className="row">
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Họ và tên</label>
                        <input onChange={(e) => handleChange(e)} name='name' value={patientData?.user?.name || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Email</label>
                        <input onChange={(e) => handleChange(e)} name='email' value={patientData?.user?.email || ''} className="form-control" type="email" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Điện thoại</label>
                        <input onChange={(e) => handleChange(e)} name='phone' value={patientData?.user?.phone || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Giới tính</label>
                        <input onChange={(e) => handleChange(e)} name='gender' value={patientData?.gender || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Ngày sinh</label>
                        <input onChange={(e) => handleChange(e)} name='dob' value={patientData?.dob || ''} className="form-control" type="date" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Dân tộc</label>
                        <input onChange={(e) => handleChange(e)} name='ethnicity' value={patientData?.ethnicity || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Nghề nghiệp</label>
                        <input onChange={(e) => handleChange(e)} name='job' value={patientData?.job || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Nơi làm việc</label>
                        <input onChange={(e) => handleChange(e)} name='workPlace' value={patientData?.workPlace || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Số BHYT</label>
                        <input onChange={(e) => handleChange(e)} name='healthInsuranceNumber' value={patientData?.healthInsuranceNumber || ''} className="form-control" type="text" />
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="form-group card-label mb-3">
                        <label>Lý do khám</label>
                        <textarea onChange={(e) => handleChange(e)} name='reason' value={reason || ''} className="form-control" />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PersonalInformation;