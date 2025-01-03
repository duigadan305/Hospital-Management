import "./AddBookingConfirm.css";

const AddBookingConfirm = ({
  patientData,
  selectedDoctor,
  selectTime,
  reason,
}) => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="rounded p-3" style={{ background: "#f8f9fa" }}>
            <div className="row">
              <div className="col-md-12 mb-2">
                <label className="payment-radio credit-card-option">
                  <span className="ms-2"></span>
                  Thông tin bệnh nhân
                </label>
              </div>
              <div mb-3v className="col-md-6">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Họ tên</label>
                  <input
                    className="form-control"
                    value={patientData?.user?.name || ""}
                    type="text"
                    readOnly
                    name="name"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-6">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Email</label>
                  <input
                    className="form-control"
                    value={patientData?.user?.email || ""}
                    type="text"
                    readOnly
                    name="email"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-4">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Điện thoại</label>
                  <input
                    className="form-control"
                    value={patientData?.user?.phone || ""}
                    type="text"
                    readOnly
                    name="phone"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-4">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Ngày sinh</label>
                  <input
                    className="form-control"
                    value={patientData?.dob || ""}
                    type="date"
                    readOnly
                    name="dob"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-4">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Giới tính</label>
                  <input
                    className="form-control"
                    value={patientData?.gender || ""}
                    type="text"
                    readOnly
                    name="gender"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-8">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Địa chỉ</label>
                  <input
                    className="form-control"
                    value={patientData?.address || ""}
                    type="text"
                    readOnly
                    name="ethnicity"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-4">
                <div className="form-group card-label mb-4">
                  <label htmlFor="card_name">Thành phố</label>
                  <input
                    className="form-control"
                    value={patientData?.city || ""}
                    type="text"
                    readOnly
                    name="job"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-6">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Quốc gia</label>
                  <input
                    className="form-control"
                    value={patientData?.country || ""}
                    type="text"
                    readOnly
                    name="workPlace"
                  />
                </div>
              </div>
              <div mb-3v className="col-md-6">
                <div className="form-group card-label mb-3">
                  <label htmlFor="card_name">Số BHYT</label>
                  <input
                    className="form-control"
                    value={patientData?.healthInsuranceNumber || ""}
                    type="text"
                    readOnly
                    name="healthInsuranceNumber"
                  />
                </div>
              </div>
            </div>

            {/* <div className="terms-accept">
                            <div className="custom-checkbox">
                                <label htmlFor="terms_accept"> Tôi đã đọc và chấp nhận các&nbsp;<a className='text-primary' style={{ cursor: 'pointer', textDecoration: 'none' }}> Điều khoản &amp; Điều kiện</a></label>
                            </div>
                        </div> */}
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
            <div className="booking-item-wrap">
              <ul className="booking-date">
                <li>
                  Bác sĩ phụ trách <span>{selectedDoctor}</span>
                </li>
                <li>
                  Thời gian <span>{selectTime}</span>
                </li>
                <li>
                  Lý do khám <span>{reason}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddBookingConfirm;
