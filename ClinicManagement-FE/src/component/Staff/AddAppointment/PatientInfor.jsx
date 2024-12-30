import { useEffect, useState } from "react";
import useAuthCheck from "../../../service/useAuthCheck";
import authApiService from "../../../service/authApiService";
import PatientApiService from "../../../service/PatientApiService";
import { useForm } from "react-hook-form";
import moment from "moment";
import { DatePicker } from "antd";
import swal from "sweetalert";

const PatientInfor = ({ patientData, setPatientData, reason, setReason }) => {
  const { authChecked, data } = useAuthCheck();
  console.log("ttttt=>", data);
  const isAuthenticated = authApiService.isAuthenticated();
  const [isChange, setIsChange] = useState("");
  const { register, handleSubmit } = useForm({});
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [email, setEmail] = useState("");

  const loadThongtin = async () => {
    if (isAuthenticated && data?.id) {
      try {
        const patientt = await PatientApiService.getPatientByEmail(email);
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

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);

    // Reset email input and button state when switching options
    if (value !== "old") {
      setEmail("");
      setIsChange(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Enable button only if email input is not empty
    setIsChange(value.trim() !== "");
  };

  const hanldeOnChange = (e) => {
    const { name, value } = e.target;

    // Danh sách các trường thuộc về `user`
    const userFields = ["name", "email", "phone"];

    setPatientData((prevData) => {
      // Kiểm tra nếu `name` thuộc `userFields`
      if (userFields.includes(name)) {
        return {
          ...prevData,
          user: {
            ...prevData.user, // Bảo toàn các giá trị trước đó trong `user`
            [name]: value, // Cập nhật giá trị cho trường trong `user`
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value, // Cập nhật giá trị cho `patientData`
        };
      }
    });

    console.log("changePa==>", patientData);
  };
  const handleChangeReason = (e) => {
    setReason(e.target.value);
  };
  const onSubmit = async () => {
    try {
      // Gọi API và đợi phản hồi
      const response = await PatientApiService.updatePatientInfo();
      setIsChange("");
      // Kiểm tra phản hồi
      if (response.statusCode === 200) {
        swal({
          icon: "success",
          text: `Cập nhật thông tin thành công!`,
          timer: 2000,
        });
      } else {
        console.log("Có lỗi xảy ra!", response);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
    }
  };

  return (
    <div>
      <div className="row form-row" style={{ marginTop: "50px" }}>
        <div className="col-md-12 d-flex" style={{ alignItems: "baseline" }}>
          <span style={{ width: "100px" }} className="form-label">
            Phân loại
          </span>
          <div className="d-flex">
            <select
              style={{ width: "200px" }}
              className="form-control select"
              onChange={handleTypeChange}
              name="type"
              value={selectedType}
            >
              <option value="new" className="text-capitalize">
                Bệnh nhân mới
              </option>
              <option value="old" className="text-capitalize">
                Đã có tài khoản
              </option>
            </select>
            {selectedType === "old" && (
              <input
                style={{ marginLeft: "10px", width: "300px" }}
                type="email"
                className="form-control"
                placeholder="Nhập email"
                value={email}
                onChange={handleEmailChange}
              />
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={loadThongtin}
            disabled={isChange ? false : true}
            style={{ width: "150px", marginLeft: "25px" }}
          >
            Load thông tin
          </button>
        </div>
      </div>
      <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label className="form-label">
              Họ và tên<span className="text-danger">*</span>
            </label>
            <input
              name="name"
              defaultValue={patientData?.user?.name || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              name="email"
              defaultValue={patientData?.user?.email || ""}
              //   disabled={isChange ? false : true}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label className="form-label">Số điện thoại</label>
            <input
              name="phone"
              defaultValue={patientData?.user?.phone || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label className="form-label">
              Ngày sinh {moment(patientData?.dob).format("DD/MM/YYYY")}
            </label>
            <input
              onChange={(e) => hanldeOnChange(e)}
              name="dob"
              value={patientData?.dob || ""}
              className="form-control"
              type="date"
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label className="form-label">Giới tính</label>
            <select
              className="form-control select"
              onChange={(e) => hanldeOnChange(e)}
              name="gender"
              value={patientData.gender || ""}
            >
              <option value={""}>Chọn</option>
              <option value="Nam" className="text-capitalize">
                Nam
              </option>
              <option value="Nữ" className="text-capitalize">
                Nữ
              </option>
              <option value="Khác" className="text-capitalize">
                Khác
              </option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group mb-2 card-label">
            <label>Số BHYT</label>
            <input
              name="healthInsuranceNumber"
              defaultValue={patientData?.healthInsuranceNumber || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group mb-2 card-label">
            <label>Quốc gia</label>
            <input
              name="country"
              defaultValue={patientData?.country || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group mb-2 card-label">
            <label>Tỉnh/Thành phố</label>
            <input
              name="city"
              defaultValue={patientData?.city || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-2 card-label">
            <label>Địa chỉ cư trú</label>
            <input
              name="address"
              defaultValue={patientData?.address || ""}
              className="form-control"
              onChange={(e) => hanldeOnChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group card-label mb-3">
            <label>Lý do khám</label>
            <textarea
              onChange={(e) => handleChangeReason(e)}
              name="reason"
              value={reason || ""}
              className="form-control"
            />
          </div>
        </div>
        {/* <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary my-3"
            disabled={isChange ? false : true}
          >
            Lưu thông tin
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default PatientInfor;
