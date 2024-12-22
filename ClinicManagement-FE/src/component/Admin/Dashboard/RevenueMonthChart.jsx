import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

const RevenueMonthChart = ({ monthlyData }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Hàm thay đổi năm
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    // Lọc dữ liệu theo năm đã chọn
    const filteredData = monthlyData.filter((item) => item.year === parseInt(selectedYear));

    // Dữ liệu biểu đồ
    const chartData = {
        labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: Array.from({ length: 12 }, (_, i) => {
                    const monthData = filteredData.find((item) => item.month === i + 1);
                    return monthData ? monthData.revenue : 0;
                }),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tháng',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Doanh thu (VND)',
                },
                beginAtZero: true,
            },
        },
    };

    // Hàm xuất dữ liệu Excel
    const exportToExcel = () => {
        const worksheetData = Array.from({ length: 12 }, (_, i) => {
            const monthData = filteredData.find((item) => item.month === i + 1) || { revenue: 0 };
            return { Tháng: i + 1, "Doanh thu (VND)": monthData.revenue };
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.sheet_add_aoa(worksheet, [["Báo cáo Doanh thu Năm " + selectedYear]], { origin: "A1" });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `DoanhThu_${selectedYear}`);
        XLSX.writeFile(workbook, `DoanhThu_${selectedYear}.xlsx`);
    };

    return (
        <div className="col-md-12 col-lg-6">
            <div className="card card-chart">
                <div className="card-header justify-content-between align-items-center">
                    <h4 className="card-title">Biểu đồ Doanh thu theo tháng</h4>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <select
                            className="form-select"
                            style={{ width: '150px' }}
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                        <button className="btn btn-success me-2" onClick={exportToExcel}>
                            Kết xuất Excel
                        </button>
                    </div>
                </div>
                <div className="card-body" style={{ height: '300px' }}>
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default RevenueMonthChart;
