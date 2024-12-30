import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import { Empty, Table, Button } from "antd";
import "./index.css";
import { useRef, useState, useEffect } from "react";
import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import PatientApiService from "../../../service/PatientApiService";
import DoctorApiService from "../../../service/DoctorApiService";
import useAuthCheck from "../../../service/useAuthCheck";

const PatientDetail = () => {
  const { role } = useAuthCheck();
  const ref = useRef();
  const { id } = useParams();
  const [patientData, setPatientData] = useState({});
  const [appointmentData, setAppointmentData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const pdata = await PatientApiService.getPatientById(id);
        const apRequest = {
          patient: { id: id },
          status: "Treated",
        };
        const apData = await DoctorApiService.getAppointmentByPatientAndStatus(
          apRequest
        );
        setPatientData(pdata.patient);
        setAppointmentData(apData.appointmentList);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    fetchAppointment();
  }, [id]);

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (type === "First" ? "Khám mới" : "Tái khám"),
      width: "15%", // Điều chỉnh độ rộng cột
    },
    {
      title: "Bác sĩ khám",
      key: "doctor.user.name",
      render: (record) => record.doctor?.user?.name || "Không có dữ liệu",
      width: "25%",
    },
    {
      title: "Lý do khám",
      dataIndex: "reason",
      key: "reason",
      width: "40%",
    },
    {
      title: "Thời gian khám",
      dataIndex: "appointmentTime",
      key: "appointmentTime",
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => {
        return (
          <Link
            to={`/medical-record/${record.id}`}
            state={{ from: `/patient-detail/${id}` }}
          >
            <Button type="primary">Xem bệnh án</Button>
          </Link>
        );
      },
      width: "20%",
    },
  ];

  let content = null;
  if (!patientData) content = <Empty />;
  if (patientData)
    content = (
      <>
        <div className="col-lg-12">
          <div className="invoice-content">
            <div className="invoice-item">
              <div className="row">
                <div className="col-md-12">
                  <div className="invoice-info">
                    <div style={{ marginBottom: "30px" }}>
                      <strong className="customer-text text-secondary">
                        THÔNG TIN BỆNH NHÂN
                      </strong>
                    </div>
                    <div className="invoice-details invoice-details-two">
                      <div className="d-flex justify-content-between patient-name">
                        <div>
                          <div>
                            <h5 style={{ fontWeight: 600 }}>
                              Họ và tên:{" "}
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                {patientData.user?.name}
                              </span>
                            </h5>
                          </div>
                          <div>
                            <p style={{ fontWeight: 600 }} className="">
                              Email:{" "}
                              <span style={{ fontWeight: "normal" }}>
                                {patientData.user?.email}
                              </span>
                            </p>
                            <p style={{ fontWeight: 600 }}>
                              Điện thoại :{" "}
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                {patientData.user?.phone}
                              </span>
                            </p>
                            <p style={{ fontWeight: 600 }}>
                              Số BHYT :{" "}
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                {patientData.healthInsuranceNumber}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div style={{ paddingTop: "28px" }}>
                          <p style={{ fontWeight: 600 }}>
                            Giới tính :{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {patientData?.gender}
                            </span>
                          </p>
                          <p style={{ fontWeight: 600 }}>
                            Ngày sinh :{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {moment().format(patientData?.dob, "DD/MM/YYYY")}
                            </span>
                          </p>
                          <p style={{ fontWeight: 600 }} className="">
                            Dân tộc:{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {patientData?.ethnicity}
                            </span>
                          </p>
                        </div>
                        <div style={{ paddingTop: "28px" }}>
                          <p style={{ fontWeight: 600 }}>
                            Nghề nghiệp :{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {patientData?.job}
                            </span>
                          </p>
                          <p style={{ fontWeight: 600 }}>
                            Nơi làm việc :{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {patientData?.workPlace}
                            </span>
                          </p>
                          <p style={{ fontWeight: 600 }} className="">
                            Địa chỉ:{" "}
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {patientData?.address}, {patientData?.city},{" "}
                              {patientData?.country}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="invoice-item invoice-table-wrap">
              <div
                className="row border-top border-2"
                style={{ paddingLeft: "12px" }}
              >
                <div className="col-md-12 px-0">
                  <div style={{ marginTop: "30px" }}>
                    <strong className="customer-text text-secondary">
                      LỊCH SỬ KHÁM
                    </strong>
                  </div>
                  <Table
                    style={{
                      width: "100%",
                      maxWidth: "1200px",
                      margin: "0 auto",
                    }}
                    columns={columns}
                    dataSource={appointmentData}
                    pagination={{ pageSize: 5 }}
                    bordered
                  />
                </div>
              </div>
            </div>
            <div className="invoice-item">
              {role === "DOCTOR" && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button type="primary" onClick={() => navigate(-1)}>
                    Quay lại
                  </Button>
                  <Link to={`/dashboard/record-general/${id}`}>
                    <Button type="primary">Tổng hợp bệnh án</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  return (
    <>
      <DashboardLayout>
        <div className="content" style={{ marginBottom: "7rem" }}>
          <div className="container-fluid" ref={ref}>
            <div className="row">{content}</div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default PatientDetail;
