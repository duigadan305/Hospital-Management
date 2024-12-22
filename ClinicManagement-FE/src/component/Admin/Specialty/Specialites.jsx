import React, { useEffect, useState } from "react";
import AdminLayout from "../Dashboard/AdminLayout";
import "./Specialites.css";
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

const Specialites = () => {
  const [doctorSpecialistOptions, setDoctorSpecialistOptions] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "add"
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialties = await CategoryApiService.getAllSpecialty();
        // Chuyển dữ liệu thành dạng phù hợp cho Radio.Group
        //   const options = specialties.map(specialty => ({
        //     label: specialty.name,
        //     value: specialty.id,
        //   }));
        setDoctorSpecialistOptions(specialties);
        setFilteredSpecialties(specialties);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = doctorSpecialistOptions.filter((specialty) =>
      specialty.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSpecialties(filtered);
  };

  // Hiển thị modal
  const openModal = (type, specialty = null) => {
    console.log("speee=>", specialty);
    setModalType(type);
    setEditingSpecialty(specialty);
    if (specialty) {
      form.setFieldsValue(specialty); // Cập nhật giá trị của form
    } else {
      form.resetFields(); // Reset form nếu không có dữ liệu
    }
    setIsModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingSpecialty(null);
  };

  // Phân trang
  const itemsPerPage = 10;
  const paginatedData = filteredSpecialties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý sửa
  const handleEdit = async (values) => {
    console.log("updaaaa=>", values);
    const request = {
      id: editingSpecialty.id,
      name: values.name,
      description: values.description,
    };
    const response = await AdminApiService.updateSpecialty(request);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Cập nhật thành công!`,
        timer: 2000,
      });
      const specialties = await CategoryApiService.getAllSpecialty();
      setDoctorSpecialistOptions(specialties);
      setFilteredSpecialties(specialties);
    }
    closeModal();
  };

  // Xử lý thêm
  const handleAdd = async (values) => {
    console.log("adddddf=>", values);
    const response = await AdminApiService.addSpecialty(values);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Thêm thành công!`,
        timer: 2000,
      });
      const specialties = await CategoryApiService.getAllSpecialty();
      setDoctorSpecialistOptions(specialties);
      setFilteredSpecialties(specialties);
    }
    closeModal();
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    const response = await AdminApiService.deleteSpecialty(id);
    if (response.statusCode === 200) {
      swal({
        icon: "success",
        text: `Xóa thành công!`,
        timer: 2000,
      });
      const specialties = await CategoryApiService.getAllSpecialty();
      setDoctorSpecialistOptions(specialties);
      setFilteredSpecialties(specialties);
    }
  };

  return (
    <>
      <AdminLayout>
        <div>
          <h1>Quản lý Chuyên khoa</h1>
          <Input.Search
            placeholder="Tìm kiếm chuyên khoa"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button
            type="primary"
            onClick={() => openModal("add")}
            style={{ marginBottom: "20px" }}
          >
            Thêm chuyên khoa mới
          </Button>
          <div style={{ textAlign: "right" }}>
            <span>Tổng số chuyên khoa: {doctorSpecialistOptions.length}</span>
          </div>
          <Table
            dataSource={paginatedData}
            rowKey="id"
            pagination={false}
            columns={[
              { title: "Tên chuyên khoa", dataIndex: "name", key: "name" },
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
            total={filteredSpecialties.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px", textAlign: "right" }}
          />
          <Modal
            title={
              modalType === "edit" ? "Sửa chuyên khoa" : "Thêm chuyên khoa"
            }
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
                label="Tên chuyên khoa"
                name="name"
                rules={[
                  { required: true, message: "Hãy nhập tên chuyên khoa!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  { required: true, message: "Hãy nhập mô tả chuyên khoa!" },
                ]}
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
export default Specialites;
