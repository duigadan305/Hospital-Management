import { useEffect, useState } from "react";
import { getRole, getUserInfo } from "./auth.service";
import authApiService from "./authApiService";

export default function useAuthCheck() {
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSkip, setIsSkip] = useState(true);
  const [data, setData] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const localAuth = getUserInfo(); // Lấy thông tin người dùng từ local storage hoặc nơi lưu trữ
    const role = getRole(); // Lấy vai trò (role) của người dùng
    const fetchData = async () => {
      if (localAuth && localAuth !== null) {
        // Kiểm tra nếu localAuth tồn tại
        try {
          const response = await authApiService.getUserByEmail(localAuth.sub); // Gọi API để lấy thông tin người dùng
          console.log("User data:", response); // Log dữ liệu người dùng để kiểm tra
          setUserId(response.user.id); // Gán userId vào state
          setIsSkip(false); // Set trạng thái isSkip
          setData(response.user); // Gán dữ liệu người dùng vào state
          setRole(role); // Gán role vào state
        } catch (error) {
          console.error("Error fetching user:", error); // Bắt lỗi nếu API gặp vấn đề
        }
      }
    };

    fetchData(); // Gọi hàm fetchData bên trong useEffect để thực thi khi component render
  }, [isSkip]); // Các dependencies để chạy lại useEffect khi dữ liệu thay đổi

  return {
    authChecked,
    data,
    role,
  };
}
