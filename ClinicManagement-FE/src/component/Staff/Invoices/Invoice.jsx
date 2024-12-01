import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import moment from "moment";
import { Empty, Table, Button } from "antd";
import './index.css';
import { useRef, useState, useEffect} from "react";
import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import PatientApiService from "../../../service/PatientApiService";
import DoctorApiService from "../../../service/DoctorApiService";
import StaffApiService from "../../../service/StaffApiService";
import swal from "sweetalert";

const Invoice = () => {
    const location = useLocation();
    const state = location?.state;
    const ref = useRef();
    const { id } = useParams();
    const [patientData, setPatientData] = useState({});
    const [appointmentData, setAppointmentData] = useState([]);
    const [medicalRecordData, setMedicalRecordData] = useState({});
    const [treatDetailData, setTreatDetailData] = useState({});
    const [serviceData, setServiceData] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [isDisable, setIsDisable] = useState(false);
    useEffect(() => {
        const fetchAppointment = async () => {
          try {
           
            const mediData = await DoctorApiService.getMedicalRecord(id);
            setMedicalRecordData(mediData.medicalRecord);
            setTreatDetailData(mediData.medicalRecord.treatmentDetail);
            setServiceData(mediData.medicalRecord.treatmentServiceList);
            setPrescriptionData(mediData.medicalRecord.prescriptionList);
            if(mediData.medicalRecord.treatmentDetail.appointment.payment == "Yes"){
                setIsDisable(true);
            }
            
          } catch (error) {
            console.error("Error fetching patient:", error);
          }
        };
    
        fetchAppointment();
      }, [ id]);

      console.log("treatdeee=>", treatDetailData);
      console.log("servvveee=>", serviceData);
      console.log("presss=>", prescriptionData);

      const servicePrice = serviceData?.reduce((sum, item) => sum + (item.service.cost || 0), 0);
      const prescriptionPrice = prescriptionData?.reduce((sum, item) => sum + (100000 || 0), 0);
      const totalPrice = servicePrice + prescriptionPrice;

      const updatedApppointmentPayment = async (data, type) => {
        try {
            const apRequest = {
                id: id,
                payment: type
            }
            // Gọi API và đợi phản hồi
            const response = await StaffApiService.handleAppointmentPayment(apRequest);
    
            // Kiểm tra phản hồi
            if (response.statusCode === 200) {
                setIsDisable(true);
                swal({
                    icon: 'success',
                    text: `Thành công`,
                    timer: 2000
                })
            } else {
                console.log("Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin bệnh nhân:", error);
        }
    };

      const serviceColumns = [
        {
            title: 'Mã xét nghiệm',
            key: 'service.code',
            render: (record) => record?.service?.code || 'Không có dữ liệu',
            width: '30%', // Điều chỉnh độ rộng cột
        },
        {
            title: 'Tên xét nghiệm',
            key: 'service.name',
            render: (record) => record?.service?.name || 'Không có dữ liệu',
            width: '40%', // Điều chỉnh độ rộng cột
        },
        {
            title: 'Giá tiền (VND)',
            key: 'cost',
            render: (record) => record?.service?.cost || 'Không có dữ liệu',
            width: '30%',
        },
        
    ];

    const prescriptColumns = [
        {
            title: 'Tên thuốc',
            key: 'name',
            render: (record) => record?.drugName || 'Không có dữ liệu',
            width: '25%', // Điều chỉnh độ rộng cột
        },
        {
            title: 'Liều lượng',
            key: 'dosage',
            render: (record) => record?.dosage || 'Không có dữ liệu',
            width: '15%',
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (record) => `${record?.quantity} ${record?.unit}` || 'Không có dữ liệu',
            width: '15%',
        },
        {
            title: 'Giá tiền (VND)',
            key: 'cost',
            render: (record) => '100000',
            width: '45%',
        },
    ];
    

    let content = null;
    if (!patientData) content = <Empty />
    if ( patientData) content =
        <>
            <div className="col-lg-8 offset-lg-2">
                <div className="invoice-content">
                    <div className="invoice-item">
                        <div style={{marginBottom:'30px', textAlign:'center'}}>
                            <strong className="customer-text" >THÔNG TIN HÓA ĐƠN</strong>
                        </div>
                    </div>

                    <div className="invoice-item invoice-table-wrap">
                        <div className="row border-top border-2" style={{paddingLeft: '12px'}}>
                            <div className="col-md-12 col-xl-9 px-0">
                                <div style={{ marginTop:'30px'}}>
                                    <strong className="customer-text text-secondary" >XÉT NGHIỆM</strong>
                                </div>
                                <Table
                                    style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                                    columns={serviceColumns}
                                    dataSource={serviceData}
                                    pagination={false}
                                    bordered
                                />
                                <div style={{ marginTop:'30px'}}>
                                    <strong className="customer-text" style={{marginRight: '5px'}}>Tổng tiền:</strong> <span>{totalPrice} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-item invoice-table-wrap">
                        <div className="row border-top border-2" style={{paddingLeft: '12px'}}>
                            <div className="col-md-12 col-xl-9 px-0">
                            <div style={{ marginTop:'30px'}}>
                                        <strong className="customer-text text-secondary" >ĐƠN THUỐC</strong>
                                    </div>
                                    <Table
                                        style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
                                        columns={prescriptColumns}
                                        dataSource={prescriptionData}
                                        pagination={false}
                                        bordered
                                    />
                                <div style={{ marginTop:'30px'}}>
                                    <strong className="customer-text" >Tổng tiền:</strong> <span>{prescriptionPrice} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-item invoice-table-wrap">
                        <div className="row border-top border-2" style={{paddingLeft: '12px'}}>
                            <div className="col-md-12 col-xl-9 px-0">
                                <div style={{ marginTop:'30px'}}>
                                    <strong style={{marginRight: '5px'}} className="customer-text" >Tổng hóa đơn: </strong> <span>{totalPrice} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-item invoice-table-wrap" style={{marginTop: '20px', display:'flex', justifyContent:'space-between'}}>
                        <Link to={state.from}>
                                <Button type="primary">Quay lại</Button>
                        </Link>
                        <Button disabled={isDisable} 
                                onClick={() => updatedApppointmentPayment(appointmentData, 'Yes')}
                                type="primary">Thanh toán</Button>
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

export default Invoice