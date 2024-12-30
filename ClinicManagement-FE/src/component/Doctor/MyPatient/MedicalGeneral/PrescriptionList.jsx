import React, { useState } from "react";

const PrescriptionList = ({ prescriptionData }) => {
  const groupedData = prescriptionData.reduce((acc, item) => {
    const time = item?.appointment?.appointmentTime;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(item);
    return acc;
  }, {});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lấy danh sách các mốc thời gian
  const timeKeys = Object.keys(groupedData);

  // Tính toán số trang
  const totalPages = Math.ceil(timeKeys.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại
  const currentData = timeKeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="prescription-container">
      <table className="prescription-table">
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Đơn thuốc</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((time) => (
            <tr key={time}>
              <td>{time}</td>
              <td>
                {groupedData[time].map((item, index) => (
                  <div key={index} className="prescription-item">
                    <strong>{item?.drugName}</strong> - {item?.dosage} -{" "}
                    {item?.quantity} {item?.unit}
                    <br />
                    {/* <em>Hướng dẫn: {item.usageInstruction || "Không có"}</em> */}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default PrescriptionList;
