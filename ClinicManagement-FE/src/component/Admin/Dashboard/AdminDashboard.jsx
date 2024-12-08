import React, { useEffect, useState } from 'react'
import './AdminDashboard.css';
import AdminLayout from './AdminLayout';
import StaffApiService from '../../../service/StaffApiService';
import CategoryApiService from '../../../service/CategoryApiService';
import AdminApiService from '../../../service/AdminApiService';
import RevenueChart from './RevenueChart';
import AppointmentChart from './AppointmentChart';

const AdminDashboard = () => {
    const [doctorData, setDoctorData] = useState([]);
    const [patientData, setPatientData] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [billData, setBillData] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [filterType, setFilterType] = useState("year"); // Mặc định theo năm
    const [filterType1, setFilterType1] = useState("year"); // Mặc định theo năm
   
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const drequest = {};
                const apdata = await StaffApiService.getAllAppointment();
                const ddata = await CategoryApiService.getAllDoctors(drequest);
                const pdata = await AdminApiService.getAllPatient();
                const bdata = await AdminApiService.getAllBill();
                
                // Cập nhật state
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

    const parseAppointmentTime = (appointmentTime) => {
        const [datePart, timePart] = appointmentTime.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [time, modifier] = timePart.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
    
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
    
        return new Date(year, month - 1, day, hours, minutes); // `month - 1` vì tháng trong JS bắt đầu từ 0
    };
    
    const aggregateAppointments = (appointmentData, type) => {
        const data = {};
    
        appointmentData.forEach((appointment) => {
            const date = parseAppointmentTime(appointment.appointmentTime);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Tháng từ 0-11, cần +1
    
            if (type === "year") {
                data[year] = (data[year] || 0) + 1; // Đếm lịch hẹn theo năm
            } else if (type === "month") {
                const currentYear = new Date().getFullYear();
                if (year === currentYear) {
                    data[month] = (data[month] || 0) + 1; // Đếm lịch hẹn theo tháng
                }
            }
        });
    
        // Trả về dữ liệu đã tổng hợp
        return Object.keys(data)
            .sort((a, b) => a - b) // Sắp xếp theo thời gian
            .map((key) => ({
                label: type === "year" ? key : `Tháng ${key}`,
                count: data[key],
            }));
    };
    const revenueData = aggregateRevenue(billData, filterType);
    const appoData = aggregateAppointments(appointmentData, filterType1);

    return (
        <>
            <AdminLayout >
                <div className="row">
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="dash-widget-header">
                                    <span className="dash-widget-icon text-primary border-primary">
                                        <i className="fe fe-users"></i>
                                    </span>
                                    <div className="dash-count">
                                        <h3>{doctorData?.length}</h3>
                                    </div>
                                </div>
                                <div className="dash-widget-info">
                                    <h6 className="text-muted">Bác sĩ</h6>
                                    <div className="progress progress-sm">
                                        <div className="progress-bar bg-primary w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="dash-widget-header">
                                    <span className="dash-widget-icon text-success">
                                        <i className="fe fe-credit-card"></i>
                                    </span>
                                    <div className="dash-count">
                                        <h3>{patientData?.length}</h3>
                                    </div>
                                </div>
                                <div className="dash-widget-info">

                                    <h6 className="text-muted">Bệnh nhân</h6>
                                    <div className="progress progress-sm">
                                        <div className="progress-bar bg-success w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="dash-widget-header">
                                    <span className="dash-widget-icon text-danger border-danger">
                                        <i className="fe fe-money"></i>
                                    </span>
                                    <div className="dash-count">
                                        <h3>{appointmentData?.length}</h3>
                                    </div>
                                </div>
                                <div className="dash-widget-info">

                                    <h6 className="text-muted">Lịch hẹn</h6>
                                    <div className="progress progress-sm">
                                        <div className="progress-bar bg-danger w-50"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="dash-widget-header">
                                    <span className="dash-widget-icon text-warning border-warning">
                                        <i className="fe fe-folder"></i>
                                    </span>
                                    <div className="dash-count">
                                        <h3>{totalBill}</h3>
                                    </div>
                                </div>
                                <div className="dash-widget-info">

                                    <h6 className="text-muted">Doanh thu (VND)</h6>
                                    <div className="progress progress-sm">
                                        <div className="progress-bar bg-warning w-50"></div>
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
                                <h4 className="card-title">Biểu đồ lịch hẹn</h4>
                                <select
                                    value={filterType1}
                                    onChange={(e) => setFilterType1(e.target.value)}
                                    className="form-control"
                                    style={{ width: "150px" }}
                                >
                                    <option value="year">Theo năm</option>
                                    <option value="month">Theo tháng</option>
                                </select>
                            </div>
                            <div className="card-body">
                                <AppointmentChart data={appoData} />
                            </div>
                        </div>

                    </div>
                    <div className="col-md-12 col-lg-6">                  
                        <div className="card card-chart">
                            <div className="card-header">
                                <h4 className="card-title">Biểu đồ Doanh thu</h4>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="form-control"
                                    style={{ width: "150px" }}
                                >
                                    <option value="year">Theo năm</option>
                                    <option value="month">Theo tháng</option>
                                </select>
                            </div>
                            <div className="card-body">
                                <RevenueChart data={revenueData} />
                            </div>
                        </div>

                    </div>
                </div>
                
            
            </AdminLayout>
        </>
    )
}
export default AdminDashboard;