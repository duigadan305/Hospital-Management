import React, { useEffect, useState } from "react";
import AdminLayout from "../Dashboard/AdminLayout";
import "../Specialty/Specialites.css";
import CategoryApiService from "../../../service/CategoryApiService";
import {
  Table,
  Modal,
  Button,
  Input,
  Pagination,
  Form,
  Popconfirm,
  Select,
} from "antd";
import AdminApiService from "../../../service/AdminApiService";
import swal from "sweetalert";
import { FaTrash } from "react-icons/fa";

const AccountManagement = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "add"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [form] = Form.useForm();
  const roleDisplayMapping = {
    USER: "Bệnh nhân",
    DOCTOR: "Bác sĩ",
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminApiService.getAllUser();
        setUserData(response.userList);
        setFilteredUser(response.userList);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Lưu email tìm kiếm
    filterData(value, searchRole); // Lọc dữ liệu dựa trên email và vai trò
  };

  const handleRoleFilter = (value) => {
    setSearchRole(value); // Lưu vai trò đã chọn
    filterData(searchTerm, value); // Lọc dữ liệu dựa trên email và vai trò
  };

  const filterData = (email, role) => {
    let filteredList = userData; // `users` là danh sách người dùng gốc

    if (email) {
      filteredList = filteredList.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    if (role) {
      filteredList = filteredList.filter((user) => user.role === role);
    }

    setFilteredUser(filteredList); // Cập nhật danh sách hiển thị
  };

  // Hiển thị modal
  const openModal = (type, user = null) => {
    console.log("speee=>", user);
    setModalType(type);
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user); // Cập nhật giá trị của form
    } else {
      form.resetFields(); // Reset form nếu không có dữ liệu
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  // Phân trang
  const itemsPerPage = 10;
  const paginatedData = filteredUser.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý thêm
  const handleAdd = async (values) => {
    try {
      console.log("adddddf=>", values);
      const response = await AdminApiService.addUser(values);

      if (response.statusCode === 200) {
        swal({
          icon: "success",
          text: "Thêm thành công!",
          timer: 2000,
        });

        const userListResponse = await AdminApiService.getAllUser();
        setUserData(userListResponse.userList);
        setFilteredUser(userListResponse.userList);
        closeModal();
      }
    } catch (error) {
      swal({
        icon: "error",
        text: "Email đã tồn tại!",
        timer: 2000,
      });
    }
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    console.log("uiddd=>", id);
    const response = await AdminApiService.deleteUser(id);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Xóa thành công!`,
        timer: 2000,
      });
      const response = await AdminApiService.getAllUser();
      setUserData(response.userList);
      setFilteredUser(response.userList);
    }
  };

  return (
    <>
      <AdminLayout>
        <div>
          <h1>Quản lý tài khoản</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Input.Search
              placeholder="Nhập email"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginBottom: "20px", margin: "0", marginRight: "10px" }}
            />
            <Select
              placeholder="Chọn vai trò"
              value={searchRole || undefined}
              onChange={(value) => handleRoleFilter(value)}
              style={{ width: "200px" }}
              allowClear
            >
              <Select.Option value="USER">Bệnh nhân</Select.Option>
              <Select.Option value="DOCTOR">Bác sĩ</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </div>
          <Button
            type="primary"
            onClick={() => openModal("add")}
            style={{ marginBottom: "20px" }}
          >
            Thêm tài khoản mới
          </Button>
          <div style={{ textAlign: "right" }}>
            <span>Tổng số tài khoản: {userData.length}</span>
          </div>
          <Table
            dataSource={paginatedData}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Tên", dataIndex: "name", key: "name" },
              { title: "Email", dataIndex: "email", key: "email" },
              { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
              {
                title: "Vai trò",
                dataIndex: "role",
                key: "role",
                render: (role) => roleDisplayMapping[role] || "Không xác định",
              },
              {
                title: "Thao tác",
                key: "actions",
                render: (_, record) => (
                  <>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa?"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button type="link" danger>
                        <FaTrash />
                      </Button>
                    </Popconfirm>
                  </>
                ),
              },
            ]}
          />
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredUser.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px", textAlign: "right" }}
          />
          <Modal
            title={modalType === "edit" ? "Sửa chuyên khoa" : "Tạo tài khoản"}
            visible={isModalVisible}
            onCancel={closeModal}
            footer={null}
          >
            <Form
              form={form}
              initialValues={{ name: "", description: "" }}
              onFinish={modalType === "edit" ? handleAdd : handleAdd}
            >
              <Form.Item
                label="Tên"
                name="name"
                rules={[
                  { required: true, message: "Hãy nhập tên người dùng!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Hãy nhập email!" },
                  { type: "email", message: "Hãy nhập đúng định dạng email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Hãy nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Số điện thoại chỉ được chứa số!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Hãy chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Select.Option key="USER" value="USER">
                    Bệnh nhân
                  </Select.Option>
                  <Select.Option key="DOCTOR" value="DOCTOR">
                    Bác sĩ
                  </Select.Option>
                  <Select.Option key="STAFF" value="STAFF">
                    Nhân viên
                  </Select.Option>
                  <Select.Option key="ADMIN" value="ADMIN">
                    Quản trị viên
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {modalType === "edit" ? "Lưu thay đổi" : "Tạo mới"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </AdminLayout>
    </>
  );
};

export default AccountManagement;
