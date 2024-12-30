import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Row, Col } from "antd";
import CategoryApiService from "../../../service/CategoryApiService";
import moment from "moment";
import AdminApiService from "../../../service/AdminApiService";
import swal from "sweetalert";
import PatientApiService from "../../../service/PatientApiService";
import { FaPen } from "react-icons/fa";

const { Option } = Select;

const StaffTab = () => {
  const [data, setData] = useState([]); // Dữ liệu danh sách bác sĩ
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [form] = Form.useForm();

  // Lấy danh sách chuyên khoa

  const handleSearch = async (values) => {
    console.log("Tìm kiếm với điều kiện:", values);
    const request = {
      user: {
        name: values.name || undefined,
        email: values.email || undefined,
        role: "STAFF",
      },
    };
    setSearchName(values.name);
    setSearchEmail(values.email);
    console.log("reqqq=>", request);
    const response = await AdminApiService.getEmployeeByCondition(request);
    setData(response.employeeList);
    console.log("docccc=>", response.employeeList);
    // Thực hiện logic tìm kiếm
  };

  const openModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleSave = async (values) => {
    const request = { id: editingRecord.id, ...values };
    console.log("Lưu thay đổi:", { request });
    const response = await AdminApiService.updateEmployeeInfor(request);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Cập nhật thành công!`,
        timer: 2000,
      });
      const eRequest = {
        user: {
          name: searchName || undefined,
          email: searchEmail || undefined,
          role: "STAFF",
        },
      };
      const response = await AdminApiService.getEmployeeByCondition(eRequest);
      setData(response.employeeList);
    }
    closeModal();
  };

  return (
    <div>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item label="Tên" name="name">
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input placeholder="Nhập email" />
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
            title: "Tên",
            dataIndex: "user.name",
            key: "user.name",
            render: (text, record) => (record.user ? record.user.name : ""),
          },
          {
            title: "Email",
            dataIndex: "user.email",
            key: "user.email",
            render: (text, record) => (record.user ? record.user.email : ""),
          },
          {
            title: "Điện thoại",
            dataIndex: "user.phone",
            key: "user.phone",
            render: (text, record) => (record.user ? record.user.phone : ""),
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            render: (gender) => {
              if (gender === "Female") return "Nữ";
              if (gender === "Male") return "Nam";
              return "Khác"; // Trường hợp giá trị không phải Male hoặc Female
            },
          },
          {
            title: "Ngày sinh",
            dataIndex: "dob",
            key: "dob",
            render: (text, record) => {
              // Kiểm tra xem giá trị ngày sinh có hợp lệ không, nếu có thì format lại
              return text ? moment(record.dob).format("DD/MM/YYYY") : "";
            },
          },
          {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (text, record) => {
              const addressParts = [];

              // Kiểm tra các trường có giá trị và thêm vào mảng addressParts
              if (record.address) addressParts.push(record.address);
              if (record.city) addressParts.push(record.city);
              if (record.country) addressParts.push(record.country);

              // Nối các phần tử lại với dấu "," nếu có nhiều hơn 1 phần tử
              return addressParts.length > 0 ? addressParts.join(", ") : "";
            },
          },
          {
            title: "Thao tác",
            key: "actions",
            render: (text, record) => (
              <Button onClick={() => openModal(record)}>
                <FaPen color="blue" />
              </Button>
            ),
          },
        ]}
        dataSource={data}
        rowKey="id"
        style={{ marginTop: "20px" }}
      />

      <Modal
        title="Sửa thông tin nhân viên"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item
            label="Tên"
            name={["user", "name"]}
            rules={[{ required: true, message: "Hãy nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name={["user", "email"]}
            rules={[
              { required: true, message: "Hãy nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Điện thoại"
            name={["user", "phone"]}
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
            label="Giới tính"
            name={["gender"]}
            rules={[{ required: false, message: "" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option key="Male" value="Male">
                Nam
              </Option>
              <Option key="Female" value="Female">
                Nữ
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name={["dob"]}
            rules={[
              { required: false, message: "" },
              { type: "date", message: "" },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thành phố"
                name={["city"]}
                rules={[{ required: false, message: "Hãy nhập thành phố!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quốc gia"
                name={["country"]}
                rules={[{ required: false, message: "Hãy nhập quốc gia!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Địa chỉ */}
          <Form.Item
            label="Địa chỉ"
            name={["address"]}
            rules={[{ required: false, message: "Hãy nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffTab;