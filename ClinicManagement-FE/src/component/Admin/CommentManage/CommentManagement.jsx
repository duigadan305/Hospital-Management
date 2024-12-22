import React from "react";
import { Tabs } from "antd";
import AdminLayout from "../Dashboard/AdminLayout.jsx";

import ContactTab from "./ContactTab.jsx";
import ReviewDoctorTab from "./ReviewDoctorTab.jsx";

const { TabPane } = Tabs;

const CommentManagement = () => {
  return (
    <AdminLayout>
      <div>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Liên hệ" key="1">
            <ContactTab />
          </TabPane>
          <TabPane tab="Đánh giá bác sĩ" key="2">
            <ReviewDoctorTab />
          </TabPane>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CommentManagement;
