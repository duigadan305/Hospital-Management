import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import CategoryApiService from "../../../service/CategoryApiService";
import moment from "moment";
import AdminApiService from "../../../service/AdminApiService";
import swal from "sweetalert";
import { FaTrash } from "react-icons/fa";

const { Option } = Select;

const ReviewDoctorTab = () => {
  const [data, setData] = useState([]);
  const [specialties, setSpecialties] = useState([]); // Danh sách chuyên khoa
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [form] = Form.useForm();

  // Lấy danh sách chuyên khoa
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        // Gọi API lấy danh sách chuyên khoa

        const specialties = await CategoryApiService.getAllSpecialty();

        setSpecialties(specialties);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
      }
    };
    fetchSpecialties();
  }, []);

  const handleSearch = async (values) => {
    console.log("Tìm kiếm với điều kiện:", values);
    const doctorRequest = {
      user: {
        name: values.name || undefined,
        email: values.email || undefined,
      },
      specialty: { id: values.specialty || undefined },
    };
    setSearchName(values.name);
    setSearchEmail(values.email);
    setSearchSpecialty(values.specialties);
    const response = await AdminApiService.getAllDoctorReview(doctorRequest);
    setData(response.commentList);
    console.log("docccc=>", response.commentList);
    // Thực hiện logic tìm kiếm
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleDelete = async (values) => {
    const request = { id: editingRecord.id, ...values };
    console.log("Lưu thay đổi:", { request });
    const response = await AdminApiService.deleteComment(editingRecord.id);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Cập nhật thành công!`,
        timer: 2000,
      });
      const doctorRequest = {
        user: {
          name: searchName || undefined,
          email: searchEmail || undefined,
        },
        specialty: { id: searchSpecialty || undefined },
      };
      const response = await AdminApiService.getAllDoctorReview(doctorRequest);
      setData(response.commentList);
    }
    closeModal();
  };

  return (
    <div>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item label="Tên bác sĩ" name="name">
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item label="Email bác sĩ" name="email">
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item label="Chuyên khoa" name="specialty">
          <Select placeholder="Chọn chuyên khoa">
            {specialties.map((specialty) => (
              <Option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={[
          {
            title: "Tên bác sĩ",
            dataIndex: "doctor.user.name",
            key: "doctor.user.name",
            render: (text, record) =>
              record.doctor.user ? record.doctor.user.name : "",
          },
          {
            title: "Email bác sĩ",
            dataIndex: "doctor.user.email",
            key: "doctor.user.email",
            render: (text, record) =>
              record.doctor.user ? record.doctor.user.email : "",
          },
          {
            title: "Tên người gửi",
            dataIndex: "patient.user.name",
            key: "patient.user.name",
            render: (text, record) =>
              record.patient.user ? record.patient.user.name : "",
          },
          {
            title: "Email người gửi",
            dataIndex: "patient.user.email",
            key: "patient.user.email",
            render: (text, record) =>
              record.patient.user ? record.patient.user.email : "",
          },
          {
            title: "Đề xuất",
            dataIndex: "subject",
            key: "user.phone",
            render: (text, record) => (record.subject ? record.subject : ""),
          },
          {
            title: "Số sao",
            dataIndex: "star",
            key: "star",
            render: (text, record) => (record.star ? record.star : ""),
          },
          {
            title: "Nội dung",
            dataIndex: "content",
            key: "star",
            render: (text, record) => (record.content ? record.content : ""),
          },
          {
            title: "Ngày gửi",
            dataIndex: "content",
            key: "star",
            render: (text, record) => (record.sendDate ? record.sendDate : ""),
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
        dataSource={data}
        rowKey="id"
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default ReviewDoctorTab;
