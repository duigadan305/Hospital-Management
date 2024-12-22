import React, { useEffect, useState } from "react";
import AdminLayout from "../Dashboard/AdminLayout";
import "./Services.css";
import CategoryApiService from "../../../service/CategoryApiService";
import {
  Table,
  Modal,
  Button,
  Input,
  Pagination,
  Form,
  Popconfirm,
} from "antd";
import AdminApiService from "../../../service/AdminApiService";
import swal from "sweetalert";
import { FaPen, FaTrash } from "react-icons/fa";

const Services = () => {
  const [serviceData, setServiceData] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingService, setEditingService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "add"
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await CategoryApiService.getAllServices();
        // Chuyển dữ liệu thành dạng phù hợp cho Radio.Group
        //   const options = specialties.map(specialty => ({
        //     label: specialty.name,
        //     value: specialty.id,
        //   }));
        setServiceData(response.serviceList);
        setFilteredServices(response.serviceList);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = serviceData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  // Hiển thị modal
  const openModal = (type, item = null) => {
    console.log("speee=>", item);
    setModalType(type);
    setEditingService(item);
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
    setEditingService(null);
  };

  // Phân trang
  const itemsPerPage = 10;
  const paginatedData = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý sửa
  const handleEdit = async (values) => {
    console.log("updaaaa=>", values);
    const request = {
      id: editingService.id,
      name: values.name,
      description: values.description,
      code: values.code,
      cost: values.cost,
    };
    const response = await AdminApiService.updateService(request);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Cập nhật thành công!`,
        timer: 2000,
      });
      const response = await CategoryApiService.getAllServices();
      setServiceData(response.serviceList);
      setFilteredServices(response.serviceList);
    }
    closeModal();
  };

  // Xử lý thêm
  const handleAdd = async (values) => {
    console.log("adddddf=>", values);
    const response = await AdminApiService.addService(values);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Thêm thành công!`,
        timer: 2000,
      });
      const response = await CategoryApiService.getAllServices();
      setServiceData(response.serviceList);
      setFilteredServices(response.serviceList);
    }
    closeModal();
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    const response = await AdminApiService.deleteService(id);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Xóa thành công!`,
        timer: 2000,
      });
      const response = await CategoryApiService.getAllServices();
      setServiceData(response.serviceList);
      setFilteredServices(response.serviceList);
      setCurrentPage(1);
    }
  };

  return (
    <>
      <AdminLayout>
        <div>
          <h1>Quản lý Dịch vụ xét nghiệm</h1>
          <Input.Search
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button
            type="primary"
            onClick={() => openModal("add")}
            style={{ marginBottom: "20px" }}
          >
            Thêm mới
          </Button>
          <div style={{ textAlign: "right" }}>
            <span>Tổng số: {serviceData.length}</span>
          </div>
          <Table
            dataSource={paginatedData}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
              { title: "Mã dịch vụ", dataIndex: "code", key: "code" },
              { title: "Giá tiền", dataIndex: "cost", key: "cost" },
              { title: "Mô tả", dataIndex: "description", key: "description" },
              {
                title: "Thao tác",
                key: "actions",
                render: (_, record) => (
                  <>
                    <Button
                      type="link"
                      onClick={() => openModal("edit", record)}
                    >
                      <FaPen />
                    </Button>
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
            total={filteredServices.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px", textAlign: "right" }}
          />
          <Modal
            title={modalType === "edit" ? "Cập nhật thông tin" : "Thêm mới"}
            visible={isModalVisible}
            onCancel={closeModal}
            footer={null}
          >
            <Form
              form={form}
              initialValues={{ name: "", description: "" }}
              onFinish={modalType === "edit" ? handleEdit : handleAdd}
            >
              <Form.Item
                label="Tên dịch vụ"
                name="name"
                rules={[{ required: true, message: "Hãy nhập tên dịch vụ!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mã dịch vụ"
                name="code"
                rules={[{ required: true, message: "Hãy nhập mã dịch vụ!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giá tiền (VND)"
                name="cost"
                rules={[{ required: true, message: "Hãy nhập giá tiền!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: false, message: "Hãy nhập mô tả!" }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {modalType === "edit" ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </AdminLayout>
    </>
  );
};
export default Services;
