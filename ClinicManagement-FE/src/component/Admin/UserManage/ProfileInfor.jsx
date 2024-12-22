import React from "react";
import { Tabs } from "antd";
import DoctorTab from "./DoctorTab";  // File DoctorTab.jsx
import PatientTab from "./PatientTab.jsx";  // File PatientTab.jsx
import AdminLayout from "../Dashboard/AdminLayout";
import StaffTab from "./StaffTab.jsx";
import AdminTab from "./AdminTab.jsx";

const { TabPane } = Tabs;

const ProfileInfor = () => {
  return (
    <AdminLayout>
        <div>
        <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Bác sĩ" key="1">
            <DoctorTab />
            </TabPane>
            <TabPane tab="Bệnh nhân" key="2">
            <PatientTab />
            </TabPane>
             <TabPane tab="Nhân viên" key="3">
            <StaffTab />
            </TabPane>
            <TabPane tab="Quản trị viên" key="4">
            <AdminTab />
            </TabPane>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default ProfileInfor;
