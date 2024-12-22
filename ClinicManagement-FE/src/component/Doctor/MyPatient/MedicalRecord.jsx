import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import moment from "moment";
import { Empty, Table, Button } from "antd";
import "./index.css";
import { useRef, useState, useEffect } from "react";
import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import PatientApiService from "../../../service/PatientApiService";
import DoctorApiService from "../../../service/DoctorApiService";
import ImageDisplayWithZoom from "./ZoomImage";

const MedicalRecord = () => {
  const location = useLocation();
  const state = location?.state;
  const ref = useRef();
  const { id } = useParams();
  const [patientData, setPatientData] = useState({});
  const [appointmentData, setAppointmentData] = useState([]);
  const [medicalRecordData, setMedicalRecordData] = useState({});
  const [treatDetailData, setTreatDetailData] = useState({});
  const [serviceData, setServiceData] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState([]);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const mediData = await DoctorApiService.getMedicalRecord(id);
        setMedicalRecordData(mediData.medicalRecord);
        setTreatDetailData(mediData.medicalRecord.treatmentDetail);
        setServiceData(mediData.medicalRecord.treatmentServiceList);
        setPrescriptionData(mediData.medicalRecord.prescriptionList);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    fetchAppointment();
  }, [id]);

  console.log("treatdeee=>", treatDetailData);
  console.log("servvveee=>", serviceData);
  console.log("presss=>", prescriptionData);

  const serviceColumns = [
    {
      title: "Tên xét nghiệm",
      key: "service.name",
      render: (record) => record?.service?.name || "Không có dữ liệu",
      width: "25%", // Điều chỉnh độ rộng cột
    },
    {
      title: "Nhận xét",
      key: "result",
      render: (record) => record?.id || "Không có dữ liệu",
      width: "35%",
    },
    {
      title: "Kết quả xét nghiệm",
      key: "fileContent",
      render: (record) => {
        if (!record?.fileContent || !record?.fileName) {
          return "Không có dữ liệu";
        }

        const fileType = record.fileName.split(".").pop().toLowerCase();
        const imageTypes = ["jpg", "jpeg", "png", "gif"];

        // Chuyển byte[] thành URL Blob
        const fileBlob = new Blob([new Uint8Array(record.fileContent)], {
          type: imageTypes.includes(fileType)
            ? `image/${fileType}`
            : "application/octet-stream",
        });
        const fileURL = URL.createObjectURL(fileBlob);

        return imageTypes.includes(fileType) ? (
          <ImageDisplayWithZoom
            fileName={record.fileName}
            fileContent={record.fileContent}
            fileType="image/jpeg" // Cập nhật theo kiểu file thực tế
          />
        ) : (
          <a href={fileURL} download={record.fileName} className="btn btn-link">
            {record.fileName}
          </a>
        );
      },
      width: "40%",
    },
  ];

  const prescriptColumns = [
    {
      title: "Tên thuốc",
      key: "name",
      render: (record) => record?.drugName || "Không có dữ liệu",
      width: "25%", // Điều chỉnh độ rộng cột
    },
    {
      title: "Liều lượng",
      key: "dosage",
      render: (record) => record?.dosage || "Không có dữ liệu",
      width: "15%",
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (record) =>
        `${record?.quantity} ${record?.unit}` || "Không có dữ liệu",
      width: "15%",
    },
    {
      title: "Cách dùng",
      key: "usageInstruction",
      render: (record) => record?.usageInstruction || "Không có dữ liệu",
      width: "45%",
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
              <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <strong className="customer-text" style={{ fontSize: "20px" }}>
                  THÔNG TIN BỆNH ÁN
                </strong>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="invoice-info">
                    <div style={{ marginBottom: "30px" }}>
                      <strong
                        className="customer-text"
                        style={{ color: "#6610f2" }}
                      >
                        BỆNH SỬ
                      </strong>
                    </div>
                    <div className="invoice-details invoice-details-two">
                      <div className="d-flex justify-content-between patient-name">
                        <div>
                          <div>
                            {treatDetailData.medicalHistory?.map((item) => (
                              <p className="">{item}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="invoice-info border-top border-2"
                    style={{ paddingTop: "20px" }}
                  >
                    <div style={{ marginBottom: "30px" }}>
                      <strong
                        className="customer-text"
                        style={{ color: "#6610f2" }}
                      >
                        CHỈ SỐ SINH TỒN
                      </strong>
                    </div>
                    <div className="invoice-details invoice-details-two">
                      <div className="d-flex justify-content-between patient-name">
                        <div>
                          <div>
                            <p className="">
                              <strong>Mạch:</strong>{" "}
                              {treatDetailData.vitalSign?.pulse} bpm
                            </p>
                            <p className="">
                              <strong>Nhiệt độ:</strong>{" "}
                              {treatDetailData.vitalSign?.temperature} °C
                            </p>
                            <p className="">
                              <strong>Nhịp thở:</strong>{" "}
                              {treatDetailData.vitalSign?.respiratoryRate} bpm
                            </p>
                          </div>
                        </div>
                        <div style={{ paddingTop: "" }}>
                          <p className="">
                            <strong>Huyết áp:</strong>{" "}
                            {treatDetailData.vitalSign?.bloodPressure} mmHg
                          </p>
                          <p className="">
                            <strong>Chỉ số Oxy:</strong>{" "}
                            {treatDetailData.vitalSign?.oxygen} %
                          </p>
                        </div>
                        <div style={{ paddingTop: "" }}>
                          <p className="">
                            <strong>Chiều cao:</strong>{" "}
                            {treatDetailData.vitalSign?.height} cm
                          </p>
                          <p className="">
                            <strong>Cân nặng:</strong>{" "}
                            {treatDetailData.vitalSign?.weight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="invoice-info border-top border-2"
                    style={{ paddingTop: "20px" }}
                  >
                    <div style={{ marginBottom: "30px" }}>
                      <strong
                        className="customer-text"
                        style={{ color: "#6610f2" }}
                      >
                        KHÁM BỘ PHẬN
                      </strong>
                    </div>
                    <div className="invoice-details invoice-details-two">
                      <div className="d-flex justify-content-between patient-name">
                        <div>
                          {treatDetailData.partExamination?.map(
                            (item, index) => (
                              <div key={index}>
                                {Object.entries(item).map(([key, value]) => (
                                  <p key={key}>
                                    <strong>{key}:</strong> {value}
                                  </p>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="invoice-info border-top border-2"
                    style={{ paddingTop: "20px" }}
                  >
                    <div style={{ marginBottom: "30px" }}>
                      <strong
                        className="customer-text"
                        style={{ color: "#6610f2" }}
                      >
                        KHÁM TỔNG QUÁT
                      </strong>
                    </div>
                    <div className="invoice-details invoice-details-two">
                      <div className="d-flex justify-content-between patient-name">
                        <div>
                          {treatDetailData.bodyExamination?.map(
                            (item, index) => (
                              <div key={index}>
                                {Object.entries(item).map(([key, value]) => (
                                  <p key={key}>
                                    <strong>{key}:</strong> {value}
                                  </p>
                                ))}
                              </div>
                            )
                          )}
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
                <div className="col-md-12 col-xl-9 px-0">
                  <div style={{ marginTop: "30px" }}>
                    <strong
                      className="customer-text"
                      style={{ color: "#6610f2" }}
                    >
                      KẾT QUẢ XÉT NGHIỆM
                    </strong>
                  </div>
                  <Table
                    style={{
                      width: "100%",
                      maxWidth: "1200px",
                      margin: "0 auto",
                    }}
                    columns={serviceColumns}
                    dataSource={serviceData}
                    pagination={false}
                    bordered
                  />
                </div>
              </div>
            </div>

            <div className="invoice-item invoice-table-wrap">
              <div
                className="row border-top border-2"
                style={{ paddingLeft: "12px" }}
              >
                <div className="col-md-12 col-xl-9 px-0">
                  <div style={{ marginTop: "30px" }}>
                    <strong
                      className="customer-text"
                      style={{ color: "#6610f2" }}
                    >
                      ĐƠN THUỐC
                    </strong>
                  </div>
                  <Table
                    style={{
                      width: "100%",
                      maxWidth: "1200px",
                      margin: "0 auto",
                    }}
                    columns={prescriptColumns}
                    dataSource={prescriptionData}
                    pagination={false}
                    bordered
                  />
                </div>
              </div>
            </div>

            <div
              className="invoice-item invoice-table-wrap"
              style={{ marginTop: "20px" }}
            >
              <Link to={state.from}>
                <Button type="primary">Quay lại</Button>
              </Link>
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

export default MedicalRecord;
