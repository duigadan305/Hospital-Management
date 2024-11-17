import moment from 'moment';
import img from '../../../images/avatar.jpg';
import { Link } from 'react-router-dom';
import './BookingCheckout.css';

const CheckoutPage = ({ patientData, setPatientData, selectedDoctor, setSelectedDoctor, selectTime, setSelectTime, reason, setReason }) => {
    const handleCheck = () => {
        
    }

    const handleChange = (e) => {
        
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8" >
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>

                        <div className='row'>
                            <div className="col-md-12 mb-2">
                                <label className="payment-radio credit-card-option">
                                    <span className="ms-2"></span>
                                    Thông tin bệnh nhân
                                </label>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Họ tên</label>
                                    <input className="form-control" value={patientData?.user?.name || ''} type="text" readOnly name='name' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Email</label>
                                    <input className="form-control" value={patientData?.user?.email || ''} type="text" readOnly name='email' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Điện thoại</label>
                                    <input className="form-control" value={patientData?.user?.phone || ''} type="text" readOnly name='phone' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Ngày sinh</label>
                                    <input className="form-control" value={patientData?.dob || ''} type="date" readOnly name='dob' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-4">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Giới tính</label>
                                    <input className="form-control" value={patientData?.gender || ''} type="text" readOnly name='gender' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Dân tộc</label>
                                    <input className="form-control" value={patientData?.ethnicity || ''} type="text" readOnly name='ethnicity' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Nghề nghiệp</label>
                                    <input className="form-control" value={patientData?.job || ''} type="text" readOnly name='job' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Nơi làm việc</label>
                                    <input className="form-control" value={patientData?.workPlace || ''} type="text" readOnly name='workPlace' />
                                </div>
                            </div>
                            <div mb-3v className="col-md-6">
                                <div className="form-group card-label mb-3">
                                    <label htmlFor="card_name">Số BHYT</label>
                                    <input className="form-control" value={patientData?.healthInsuranceNumber || ''} type="text" readOnly name='healthInsuranceNumber' />
                                </div>
                            </div>
                        </div>

                        
                        <div className="terms-accept">
                            <div className="custom-checkbox">
                                <label htmlFor="terms_accept"> I have read and accept <a className='text-primary' style={{ cursor: 'pointer', textDecoration: 'none' }}>Terms &amp; Conditions</a></label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 col-sm-12">
                    <div className="d-flex gap-2 mt-3 mb-3">
                                <div>                    
                                    <span className="checkmark ms-3"></span>
                                    Thông tin lịch hẹn
                                </div>
                    
                    </div>
                    <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
                        { <Link to={`/doctors/profile/${selectedDoctor}`} className="booking-doc-img d-flex justify-content-center mb-2">
                            <img src={''} alt="" />
                        </Link>}
                        {  <div className='doc-title-info mt-3 mb-3'>
                            <h5 className='mt-3 text-center' style={{
                                fontSize: "22px", fontWeight: 700,
                            }}>Dr. {selectedDoctor}</h5>
                            <div className='text-center'>
                                <p className='form-text mb-0'>{''}</p>
                                <p className='form-text mb-0'>{''}</p>
                            </div>
                        </div>}

                        <div className="booking-item-wrap">
                            <ul className="booking-date">
                                <li>Thời gian <span>{selectTime}</span></li>
                                <li>Lý do khám <span>{reason}</span></li>
                            </ul>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CheckoutPage;