import { useEffect, useState } from "react";
import { useGetDoctorQuery } from "../api/doctorApi";
import { useGetPatientQuery } from "../api/patientApi";
import { getRole, getUserInfo } from "../../service/auth.service";
import authApiService from "../../service/authApiService";
import PatientApiService from "../../service/PatientApiService";

export default function useAuthCheck() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSkip, setIsSkip] = useState(true);
  const [data, setData] = useState({});
  const [role, setRole] = useState("");
  const {
    data: doctorData,
    isError,
    isSuccess: dIsSuccess,
  } = useGetDoctorQuery(userId, { skip: isSkip });
  const {
    data: patientData,
    isError: pIsError,
    isSuccess: pIsSuccess,
  } = useGetPatientQuery(userId, { skip: isSkip });

  useEffect(() => {
    const localAuth = getUserInfo(); // Lấy thông tin người dùng từ local storage hoặc nơi lưu trữ
    const role = getRole(); // Lấy vai trò (role) của người dùng
    const fetchData = async () => {
      if (localAuth && localAuth !== null) {
        // Kiểm tra nếu localAuth tồn tại
        try {
          const response = await authApiService.getUserByEmail(localAuth.sub); // Gọi API để lấy thông tin người dùng
          console.log("User data:", response); // Log dữ liệu người dùng để kiểm tra

          if (role === "USER") {
            setUserId(response.user.id); // Gán userId vào state
            setIsSkip(false); // Set trạng thái isSkip
            setData(response.user); // Gán dữ liệu người dùng vào state
            setRole(role); // Gán role vào state
            setAuthChecked(pIsSuccess && !pIsError); // Cập nhật trạng thái xác thực
          } else if (role === "DOCTOR") {
            setUserId(response.user.id); // Gán userId vào state
            setIsSkip(false); // Set trạng thái isSkip
            setData(response.user); // Gán dữ liệu người dùng vào state
            setRole(role); // Gán role vào state
            setAuthChecked(dIsSuccess && !isError); // Cập nhật trạng thái xác thực
          }
        } catch (error) {
          console.error("Error fetching user:", error); // Bắt lỗi nếu API gặp vấn đề
        }
      }
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect để thực thi khi component render
  }, [pIsSuccess, pIsError, dIsSuccess, isError]); // Các dependencies để chạy lại useEffect khi dữ liệu thay đổi

  return {
    authChecked,
    data,
    role,
  };
}
