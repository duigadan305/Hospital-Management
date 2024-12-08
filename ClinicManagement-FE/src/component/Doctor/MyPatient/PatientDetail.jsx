import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import { Empty, Table, Button } from "antd";
import './index.css';
import { useRef, useState, useEffect} from "react";
import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import PatientApiService from "../../../service/PatientApiService";
import DoctorApiService from "../../../service/DoctorApiService";
import useAuthCheck from "../../../service/useAuthCheck";

const PatientDetail = () => {
    const { role } = useAuthCheck();
    const ref = useRef();
    const { id } = useParams();
    const [patientData, setPatientData] = useState({});
    const [appointmentData, setAppointmentData] = useState([]);

    useEffect(() => {
        const fetchAppointment = async () => {
          try {
           
            const pdata = await PatientApiService.getPatientById(id);
            const apRequest = {
                patient: {id: id},
                status: "Treated"
            }
            const apData = await DoctorApiService.getAppointmentByPatientAndStatus(apRequest);
            setPatientData(pdata.patient);
            setAppointmentData(apData.appointmentList);
            
          } catch (error) {
            console.error("Error fetching patient:", error);
          }
        };
    
        fetchAppointment();
      }, [ id]);

      const columns = [
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (type === 'First' ? 'Khám mới' : 'Tái khám'),
            width: '15%', // Điều chỉnh độ rộng cột
        },
        {
            title: 'Bác sĩ khám',
            key: 'doctor.user.name',
            render: (record) => record.doctor?.user?.name || 'Không có dữ liệu',
            width: '25%',
        },
        {
            title: 'Lý do khám',
            dataIndex: 'reason',
            key: 'reason',
            width: '30%',
        },
        {
            title: 'Thời gian khám',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
            width: '30%',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record) => {
                return (
                    <Link 
                        to={`/medical-record/${record.id}`}
                        state={{ from: `/patient-detail/${id}` }} 
                    >
                        <Button type="primary">Xem bệnh án</Button>
                    </Link>
                );
            },
            width: '20%',
        },
    ];
    

    let content = null;
    if (!patientData) content = <Empty />
    if ( patientData) content =
        <>
            <div className="col-lg-8" style={{marginLeft:'10px'}}>
                <div className="invoice-content">
                    <div className="invoice-item">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="invoice-info" >
                                    <div style={{marginBottom:'30px'}}>
                                        <strong className="customer-text text-secondary" >THÔNG TIN BỆNH NHÂN</strong>
                                    </div>
                                    <div className="invoice-details invoice-details-two">
                                        <div className="d-flex justify-content-between patient-name">
                                            <div>
                                                <h5 style={{ fontWeight: 700 }}>Họ và tên: {patientData.user?.name}</h5>
                                                <div>
                                                    <p className="">Email: {patientData.user?.email}</p>
                                                    <p>Điện thoại : {patientData.user?.phone}</p>
                                                    <p>Số BHYT : {patientData.healthInsuranceNumber}</p>
                                                </div>
                                            </div>
                                            <div style={{paddingTop:'28px'}}>
                                                <p>Giới tính : {patientData?.gender}</p>
                                                <p>Ngày sinh : {moment().format(patientData?.dob, 'DD/MM/YYYY')}</p>
                                                <p className="">Dân tộc: {patientData?.ethnicity}</p>
                                            </div>
                                            <div style={{paddingTop:'28px'}}>
                                                
                                                <p>Nghề nghiệp : {patientData?.job}</p>
                                                <p>Nơi làm việc : {patientData?.workPlace}</p>
                                                <p className="">Địa chỉ: {patientData?.address}, {patientData?.city}, {patientData?.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-item invoice-table-wrap">
                        <div className="row border-top border-2" style={{paddingLeft: '12px'}}>
                            <div className="col-md-12 col-xl-9 px-0">
                            <div style={{ marginTop:'30px'}}>
                                        <strong className="customer-text text-secondary" >LỊCH SỬ KHÁM</strong>
                                    </div>
                                    <Table
                                        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                                        columns={columns}
                                        dataSource={appointmentData}
                                        pagination={{ pageSize: 5 }}
                                        bordered
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="invoice-item" style={{display:'flex', justifyContent:'space-between'}}>
                        <Link to={`/dashboard/my-patients`}>
                            <Button type="primary">Quay lại</Button>
                        </Link>
                        {role === "DOCTOR"&&
                        <div>
                            <Link to={`/dashboard/record-general/${id}`}>
                                <Button type="primary">Tổng hợp bệnh án</Button>
                            </Link>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    return (
        <>
            <DashboardLayout>
                <div className="content" style={{ marginBottom: '7rem' }}>
                    <div className="container-fluid" ref={ref}>
                        <div className="row">
                            {content}
                        </div>
                    </div>
                </div>
            </DashboardLayout>

        </>
    )
}

export default PatientDetail