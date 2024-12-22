import React, { useEffect, useState } from 'react'
import './AdminDashboard.css';
import AdminLayout from './AdminLayout';
import StaffApiService from '../../../service/StaffApiService';
import CategoryApiService from '../../../service/CategoryApiService';
import AdminApiService from '../../../service/AdminApiService';
import RevenueChart from './RevenueChart';
import AppointmentChart from './AppointmentChart';
import { FaMoneyBillWave, FaCalendarAlt, FaSnapchat } from "react-icons/fa";
import { FaPersonBreastfeeding } from 'react-icons/fa6';
import RevenueMonthChart from './RevenueMonthChart';

const AdminDashboard = () => {
    const [doctorData, setDoctorData] = useState([]);
    const [patientData, setPatientData] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [billData, setBillData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [filterType, setFilterType] = useState("year"); // Mặc định theo năm
    const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0);
    const [totalYearlyRevenue, setTotalYearlyRevenue] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
   
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const drequest = {};
                const apdata = await StaffApiService.getAllAppointment();
                const ddata = await CategoryApiService.getAllDoctors(drequest);
                const pdata = await AdminApiService.getAllPatient();
                const bdata = await AdminApiService.getAllBill();
                const response = await AdminApiService.getAllReviewContact();
                
                // Cập nhật state
                setCommentData(response.commentList);
                setAppointmentData(apdata.appointmentList);
                setDoctorData(ddata.doctorList);
                setPatientData(pdata.patientList);
                setBillData(bdata.appointmentBillList);
                setTotalBill(bdata?.appointmentBillList?.reduce((sum, item) => sum + (item.total || 0), 0))
            } catch (error) {
                console.error("Error fetching appointment:", error);
            }
        };
        
        fetchAppointment();
    }, [doctorData, patientData, appointmentData, billData]);
    
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const bdata = await AdminApiService.getAllBill();
                setBillData(bdata.appointmentBillList);

                // Tính tổng doanh thu tháng và năm hiện tại
                const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
                const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
                const calculatedData = calculateMonthlyData(bdata.appointmentBillList);
                setMonthlyData(calculatedData);
                const monthlyRevenue = bdata.appointmentBillList.reduce((sum, bill) => {
                    const payDate = new Date(bill.payDate);
                    if (payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear) {
                        return sum + (bill.total || 0);
                    }
                    return sum;
                }, 0);

                const yearlyRevenue = bdata.appointmentBillList.reduce((sum, bill) => {
                    const payDate = new Date(bill.payDate);
                    if (payDate.getFullYear() === currentYear) {
                        return sum + (bill.total || 0);
                    }
                    return sum;
                }, 0);

                setTotalMonthlyRevenue(monthlyRevenue);
                setTotalYearlyRevenue(yearlyRevenue);
            } catch (error) {
                console.error("Error fetching appointment bills:", error);
            }
        };

        fetchAppointment();
    }, []);

    const aggregateRevenue = (billData, type) => {
        const data = {};
        
        billData.forEach((bill) => {
            const date = new Date(bill.payDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Tháng từ 0-11, cần +1
            
            if (type === "year") {
                data[year] = (data[year] || 0) + bill.total;
            } else if (type === "month") {
                const currentYear = new Date().getFullYear();
                if (year === currentYear) {
                    data[month] = (data[month] || 0) + bill.total;
                }
            }
        });
        
        // Trả về dữ liệu đã tổng hợp
        return Object.keys(data)
        .sort((a, b) => a - b) // Sắp xếp theo thời gian
        .map((key) => ({
            label: type === "year" ? key : `Tháng ${key}`,
            revenue: data[key],
        }));
    };
    
    const revenueData = aggregateRevenue(billData, filterType);

    const calculateMonthlyData = (appointmentBillList) => {
        const monthlyDataMap = {};
    
        appointmentBillList.forEach((bill) => {
            const payDate = new Date(bill.payDate);
            const year = payDate.getFullYear();
            const month = payDate.getMonth() + 1; // Tháng bắt đầu từ 0 trong JS
    
            const key = `${year}-${month}`;
            if (!monthlyDataMap[key]) {
                monthlyDataMap[key] = { year, month, revenue: 0 };
            }
    
            monthlyDataMap[key].revenue += bill.total; // Tổng doanh thu theo tháng
        });
    
        return Object.values(monthlyDataMap); // Chuyển map thành array
    };
    

    return (
        <>
            <AdminLayout >
                <div className="row">
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card simple-card border-left-blue">
                            <div className="card-body">
                                <div className="card-content">
                                    <div className="info">
                                        <h6>Doanh thu tháng</h6>
                                        <h3>{totalMonthlyRevenue.toLocaleString()} đ</h3>
                                    </div>
                                    <div className="icon">
                                        <FaCalendarAlt size={40} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card simple-card border-left-green">
                            <div className="card-body">
                                <div className="card-content">
                                    <div className="info">
                                        <h6>Doanh thu năm</h6>
                                        <h3>{totalYearlyRevenue.toLocaleString()} đ</h3>
                                    </div>
                                    <div className="icon">
                                    <FaMoneyBillWave size={40} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card simple-card border-left-orange">
                            <div className="card-body">
                                <div className="card-content">
                                    <div className="info">
                                        <h6>Bệnh nhân đăng ký</h6>
                                        <h3>{patientData.length}</h3>
                                    </div>
                                    <div className="icon">
                                    <FaPersonBreastfeeding size={40} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card simple-card border-left-red">
                            <div className="card-body">
                                <div className="card-content">
                                    <div className="info">
                                        <h6>Lượt liên hệ</h6>
                                        <h3>{commentData.length}</h3>
                                    </div>
                                    <div className="icon">
                                    <FaSnapchat size={40} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">                   
                    <div className="col-md-12 col-lg-6">                  
                        <div className="card card-chart">
                            <div className="card-header">
                                <h4 className="card-title">Biểu đồ Doanh thu theo năm</h4>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="form-control"
                                    style={{ width: "150px" }}
                                >
                                    <option value="year">Theo năm</option>
                    
                                </select>
                            </div>
                            <div className="card-body">
                                <RevenueChart data={revenueData} />
                            </div>
                        </div>
                    </div>
                    <RevenueMonthChart monthlyData={monthlyData} />
                </div>
                
            
            </AdminLayout>
        </>
    )
}
export default AdminDashboard;