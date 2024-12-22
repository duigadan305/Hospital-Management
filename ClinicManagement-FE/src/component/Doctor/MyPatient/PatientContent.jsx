import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

import { FaEye } from "react-icons/fa";
import { Button } from "antd";

const PatientContent = ({ data }) => {
  return (
    <div
      className="mb-4 rounded"
      style={{ background: "#f3f3f3", display: "grid", width: "100%" }}
    >
      <div className="d-flex p-3 justify-content-between">
        <div className="d-flex gap-3">
          <div className="doc-info">
            <h5 className="mb-0">
              <span style={{ marginRight: "13px" }}>Họ và tên:</span>
              {data?.user.name}
            </h5>
            <p className="m-0 form-text">
              {" "}
              <span style={{ marginRight: "51px" }}>Email:</span>
              {data?.user?.email}
            </p>
            <p className="doc-department m-0">
              <span style={{ marginRight: "10px" }}>Điện thoại:</span>
              {data?.user.phone}
            </p>
          </div>
        </div>
        <div className="doc-info-right me-3" style={{ alignContent: "center" }}>
          <Link to={`/patient-detail/${data?.id}`}>
            <Button type="primary" icon={<FaEye />} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PatientContent;
