import React, { useState } from 'react';
import './GridCards.css';

function ServiceResult(serviceData) {
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số mốc thời gian hiển thị mỗi trang

  // Nhóm dữ liệu theo mốc thời gian
  const groupedData = serviceData.serviceData.reduce((acc, item) => {
    const time = item.appointment.appointmentTime;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(item);
    return acc;
  }, {});

  // Phân trang
  const timeKeys = Object.keys(groupedData);
  const totalPages = Math.ceil(timeKeys.length / itemsPerPage);
  const paginatedTimeKeys = timeKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCardClick = (item) => {
    const  fileContent = item.fileContent;
    const fileName = item.fileName;
    const fileExtension = fileName.split('.').pop().toLowerCase();
  
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {  
      // Tạo URL ảnh Base64
      const imageUrl = `data:image/${fileExtension};base64,${fileContent}`;
      
      // Hiển thị ảnh trong tab mới
      const imgWindow = window.open();
    imgWindow.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f0f0f0;
            }
            img {
              max-width: 80%;
              max-height: 80%;
              object-fit: contain;
              border: 1px solid #ccc;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="${fileName}" />
        </body>
      </html>
    `);
    imgWindow.document.close();
    } else if (['docx', 'xlsx'].includes(fileExtension)) {
      // Tải xuống file DOCX hoặc XLSX
      const blob = new Blob([fileContent], {
        type: fileExtension === 'docx' 
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Xử lý PDF
      const pdfBlob = new Blob([fileContent], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(pdfBlob);
      window.open(fileUrl);
    }
  };
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="grid-wrapper">
      {paginatedTimeKeys.map((time) => (
        <div key={time} className="time-group">
          <h3 className="time-title">{time}</h3>
          <div className="grid-container">
            {groupedData[time].map((item) => (
              <div key={item.id} className="card" onClick={() => handleCardClick(item)}>
                <h4>{item.service.name}</h4>
                <p><strong>Đánh giá:</strong> {item.result}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        &gt;
        </button>
      </div>
    </div>
  );
}

export default ServiceResult;
