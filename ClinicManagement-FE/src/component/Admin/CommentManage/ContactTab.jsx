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

const ContactTab = () => {
  const [commentData, setCommentData] = useState([]);
  const [filteredComment, setFilteredComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "add"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await AdminApiService.getAllReviewContact();
        setCommentData(response.commentList);
        setFilteredComment(response.commentList);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchComment();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value); // Lưu email tìm kiếm
    filterData(value, searchRole); // Lọc dữ liệu dựa trên email và vai trò
  };

  const handleRoleFilter = (value) => {
    setSearchRole(value); // Lưu vai trò đã chọn
    filterData(searchTerm, value); // Lọc dữ liệu dựa trên email và vai trò
  };

  const filterData = (email) => {
    let filteredList = commentData; // `users` là danh sách người dùng gốc

    if (email) {
      filteredList = filteredList.filter((cmt) =>
        cmt.patient.user.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    setFilteredComment(filteredList); // Cập nhật danh sách hiển thị
  };

  // Hiển thị modal
  const openModal = (type, item = null) => {
    console.log("speee=>", item);
    setModalType(type);
    setEditingItem(item);
    if (item) {
      form.setFieldsValue(item); // Cập nhật giá trị của form
    } else {
      form.resetFields(); // Reset form nếu không có dữ liệu
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingItem(null);
  };

  // Phân trang
  const itemsPerPage = 10;
  const paginatedData = filteredComment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý xóa
  const handleDelete = async (id) => {
    console.log("uiddd=>", id);
    const response = await AdminApiService.deleteComment(id);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Xóa thành công!`,
        timer: 2000,
      });
      const response = await AdminApiService.getAllReviewContact();
      setCommentData(response.commentList);
      setFilteredComment(response.commentList);
    }
  };

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Input.Search
            placeholder="Nhập email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px", margin: "0", marginRight: "10px" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <span>Tổng số phản hồi: {commentData.length}</span>
        </div>
        <Table
          dataSource={paginatedData}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Tên",
              dataIndex: "name",
              key: "name",
              render: (text, record) =>
                record.patient.user ? record.patient.user.name : "",
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
              render: (text, record) =>
                record.patient.user ? record.patient.user.email : "",
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
              key: "phone",
              render: (text, record) =>
                record.patient.user ? record.patient.user.phone : "",
            },
            {
              title: "Tiêu đề",
              dataIndex: "subject",
              key: "subject",
              render: (text, record) => (record.subject ? record.subject : ""),
            },
            {
              title: "Nội dung",
              dataIndex: "content",
              key: "content",
              render: (text, record) => (record.content ? record.content : ""),
            },
            {
              title: "Ngày gửi",
              dataIndex: "sendDate",
              key: "sendDate",
              render: (text, record) =>
                record.sendDate ? record.sendDate : "",
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
          total={filteredComment.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: "20px", textAlign: "right" }}
        />
      </div>
    </>
  );
};

export default ContactTab;
