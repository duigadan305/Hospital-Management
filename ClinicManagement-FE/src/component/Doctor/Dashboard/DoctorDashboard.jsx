import React, { useEffect, useState } from "react";
import { FaEye, FaCheck, FaTimes, FaBriefcaseMedical } from "react-icons/fa";
import { Button, Tag, Modal } from "antd";
import CustomTable from "../../Common/UI/CustomTable";
import { Tabs } from "antd";
import { Link } from "react-router-dom";
import useAuthCheck from "../../../service/useAuthCheck";
import authApiService from "../../../service/authApiService";
import DoctorApiService from "../../../service/DoctorApiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import "./index.css";
import MyPatients from "../MyPatient/MyPatients";
import swal from "sweetalert";

const DoctorDashboard = () => {
  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);
  const [sortBy, setSortBy] = useState("upcoming");
  const { authChecked, data } = useAuthCheck();
  const isAuthenticated = authApiService.isAuthenticated();
  const [appointmentData, setAppointmentData] = useState([]);
  const [todayAppointment, setTodayAppointment] = useState([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apData, setApData] = useState({});

  const showModal = async (id) => {
    try {
      const dataa = await DoctorApiService.getAppointmentById(id);
      setApData(dataa.appointment);
      console.log("apdataaaa=>", dataa.appointment);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };
  const handleCancel = () => setIsModalVisible(false);

  console.log("vaodayyyy", data);
  const checkAuthAndSetData = async () => {
    try {
      const doctorr = await DoctorApiService.getDoctorByEmail(data.email);
      setDoctorData(doctorr.doctor);
      console.log("ttttt=>", doctorr.doctor);
      const appointmentRequest = {
        doctor: { id: "1" || undefined },
      };

      console.log("iddoctorrhaha==>", appointmentRequest.doctor);
      const response = await DoctorApiService.getAppointmentByDoctorID(
        appointmentRequest
      );
      // setAppointmentData(data.appointmentList);
      // Xử lý lọc và sắp xếp
      const today = dayjs().startOf("day");
      const tomorrow = dayjs().add(1, "day").startOf("day");

      // Lọc danh sách cuộc hẹn hôm nay
      const todayAppointments = response.appointmentList
        .filter(
          (app) =>
            dayjs(app.appointmentTime, "DD/MM/YYYY hh:mm").isSame(today, "day") // Kiểm tra ngày hôm nay
        )
        .sort(
          (a, b) =>
            dayjs(a.appointmentTime, "DD/MM/YYYY hh:mm").diff(
              dayjs(b.appointmentTime, "DD/MM/YYYY hh:mm")
            ) // Sắp xếp theo thời gian
        );

      // Lọc danh sách cuộc hẹn tương lai (từ ngày mai trở đi)
      const upcomingAppointments = response.appointmentList
        .filter(
          (app) =>
            dayjs(app.appointmentTime, "DD/MM/YYYY hh:mm").isSameOrAfter(
              tomorrow,
              "day"
            ) // Kiểm tra ngày >= ngày mai
        )
        .sort(
          (a, b) =>
            dayjs(a.appointmentTime, "DD/MM/YYYY hh:mm").diff(
              dayjs(b.appointmentTime, "DD/MM/YYYY hh:mm")
            ) // Sắp xếp theo thời gian
        );

      const appData = response.appointmentList.sort(
        (a, b) =>
          dayjs(b.appointmentTime, "DD/MM/YYYY hh:mm").diff(
            dayjs(a.appointmentTime, "DD/MM/YYYY hh:mm")
          ) // Sắp xếp theo thời gian
      );

      // Cập nhật state
      setAppointmentData(appData);
      setTodayAppointment(todayAppointments);
      setUpcomingAppointment(upcomingAppointments);
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };
  useEffect(() => {
    checkAuthAndSetData();
  }, [data]);

  console.log("todayy=>", todayAppointment);
  console.log("upcomingg=>", upcomingAppointment);

  const handleOnselect = (value) => {
    // eslint-disable-next-line eqeqeq
    setSortBy(value == 1 ? "upcoming" : value == 2 ? "today" : sortBy);
  };

  const updatedApppointmentStatus = async (data, type) => {
    try {
      const apRequest = {
        id: data.id,
        status: type,
      };
      // Gọi API và đợi phản hồi
      const response = await DoctorApiService.handleAppointment(apRequest);

      // Kiểm tra phản hồi
      if (response.statusCode === 200) {
        checkAuthAndSetData();
      } else {
        console.log("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
    }
  };

  const handlePatientClick = async (e, id) => {
    e.preventDefault();
    try {
      const apRequest = {
        patient: { id: id },
        status: "Treated",
      };
      const apData = await DoctorApiService.getAppointmentByPatientAndStatus(
        apRequest
      );
      if (apData.appointmentList.length > 0) {
        // Điều hướng tới trang chi tiết bệnh nhân
        window.location.href = `/patient-detail/${id}`;
      } else {
        // Hiển thị thông báo bằng SweetAlert2
        swal({
          icon: "warning",
          text: `Không có thông tin bệnh án`,
          timer: 5000,
        });
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };

  const upcomingColumns = [
    {
      title: "Bệnh nhân",
      key: "1",
      width: 100,
      render: function (appointmentData) {
        const fullName = `${appointmentData?.patient?.user?.name ?? ""}`;
        return (
          <>
            <div className="table-avatar">
              <a
                className="avatar avatar-sm mr-2 d-flex gap-2"
                onClick={(e) =>
                  handlePatientClick(e, appointmentData?.patient?.id)
                }
              >
                <div>
                  <p
                    style={{ textAlign: "left" }}
                    className="p-0 m-0 text-nowrap"
                  >
                    {fullName}
                  </p>
                  <p style={{ textAlign: "left" }} className="p-0 m-0">
                    {appointmentData?.patient?.user?.email}
                  </p>
                </div>
              </a>
            </div>
          </>
        );
      },
    },
    {
      title: "Thời gian khám",
      key: "2",
      width: 100,
      render: function (appointmentData) {
        return (
          <div style={{ textAlign: "left" }}>
            {appointmentData.appointmentTime}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "4",
      width: 100,
      render: function (appointmentData) {
        return (
          <div style={{ textAlign: "left" }}>
            <Tag color="#87d068" className="text-uppercase">
              {appointmentData?.status === "Pending"
                ? "Chờ tiếp nhận"
                : appointmentData?.status === "Accepted"
                ? "Chấp nhận"
                : appointmentData?.status === "Pended"
                ? "Tiếp nhận"
                : appointmentData?.status === "Treated"
                ? "Đã khám"
                : "Hủy"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Dạng khám",
      key: "4",
      width: 100,
      render: function (appointmentData) {
        return (
          <div style={{ textAlign: "left" }}>
            <Tag color="#87d068" className="text-uppercase">
              {appointmentData?.type === "First" ? "Khám mới" : "Tái khám"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Tác vụ",
      key: "5",
      width: 100,
      render: function (appointmentData) {
        return (
          <div className="d-flex gap-2">
            {/* <Link to={`/dashboard/appointment-detail/${appointmentData?.id}`}>
                            </Link> */}
            <Button
              onClick={() => showModal(appointmentData?.id)}
              type="primary"
              shape="circle"
              icon={<FaEye />}
              size="small"
            />
            <Modal
              title="Thông tin chi tiết"
              open={isModalVisible}
              onCancel={handleCancel}
              className="custom-modal"
              footer={null}
            >
              <div className="popup-content">
                <div className="container mt-5">
                  <div className="row">
                    <div className="col-md-8">
                      <div
                        className="rounded p-3"
                        style={{ background: "#f8f9fa" }}
                      >
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
                                value={apData.patient?.user?.name || ""}
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
                                value={apData.patient?.user?.email || ""}
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
                                value={apData.patient?.user?.phone || ""}
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
                                value={apData.patient?.dob || ""}
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
                                value={apData.patient?.gender || ""}
                                type="text"
                                readOnly
                                name="gender"
                              />
                            </div>
                          </div>
                          <div mb-3v className="col-md-6">
                            <div className="form-group card-label mb-3">
                              <label htmlFor="card_name">Dân tộc</label>
                              <input
                                className="form-control"
                                value={apData.patient?.ethnicity || ""}
                                type="text"
                                readOnly
                                name="ethnicity"
                              />
                            </div>
                          </div>
                          <div mb-3v className="col-md-6">
                            <div className="form-group card-label mb-3">
                              <label htmlFor="card_name">Nghề nghiệp</label>
                              <input
                                className="form-control"
                                value={apData.patient?.job || ""}
                                type="text"
                                readOnly
                                name="job"
                              />
                            </div>
                          </div>
                          <div mb-3v className="col-md-6">
                            <div className="form-group card-label mb-3">
                              <label htmlFor="card_name">Nơi làm việc</label>
                              <input
                                className="form-control"
                                value={apData.patient?.workPlace || ""}
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
                                value={
                                  apData.patient?.healthInsuranceNumber || ""
                                }
                                type="text"
                                readOnly
                                name="healthInsuranceNumber"
                              />
                            </div>
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
                      <div
                        className="rounded p-3"
                        style={{ background: "#f8f9fa" }}
                      >
                        <div className="booking-item-wrap">
                          <ul className="booking-date">
                            <li>
                              Bác sĩ phụ trách{" "}
                              <span>{apData.doctor?.user?.name}</span>
                            </li>
                            <li>
                              Thời gian <span>{apData.appointmentTime}</span>
                            </li>
                            <li>
                              Lý do khám <span>{apData.reason}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            {appointmentData.status === "Accepted" && (
              <Link to={`/treatment/${appointmentData?.id}`}>
                <Button
                  type="primary"
                  icon={<FaBriefcaseMedical />}
                  size="small"
                >
                  Khám bệnh
                </Button>
              </Link>
            )}
            {appointmentData?.status === "Pended" && (
              <>
                <Button
                  type="primary"
                  // icon={<FaCheck />}
                  size="small"
                  onClick={() =>
                    updatedApppointmentStatus(appointmentData, "Accepted")
                  }
                >
                  Chấp nhận
                </Button>
                <Button
                  type="primary"
                  // icon={<FaTimes />}
                  size="small"
                  danger
                  onClick={() =>
                    updatedApppointmentStatus(appointmentData, "Cancel")
                  }
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const items = [
    {
      key: "1",
      label: "Hôm nay",
      children: (
        <CustomTable
          columns={upcomingColumns}
          dataSource={todayAppointment}
          showPagination={true}
          pageSize={10}
          showSizeChanger={true}
        />
      ),
    },
    {
      key: "2",
      label: "Sắp tới",
      children: (
        <CustomTable
          columns={upcomingColumns}
          dataSource={upcomingAppointment}
          showPagination={true}
          pageSize={10}
          showSizeChanger={true}
        />
      ),
    },
    {
      key: "3",
      label: "Tất cả",
      children: (
        <CustomTable
          columns={upcomingColumns}
          dataSource={appointmentData}
          showPagination={true}
          pageSize={10}
          showSizeChanger={true}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={handleOnselect} />;
};

export default DoctorDashboard;
