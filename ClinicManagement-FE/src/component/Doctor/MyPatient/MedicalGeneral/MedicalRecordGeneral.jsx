import React, { useEffect, useState } from 'react'
import { FaEye, FaCheck, FaTimes, FaBriefcaseMedical, FaPlus } from "react-icons/fa";
import { Button, Tag, Modal, Input } from 'antd';
import CustomTable from '../../../Common/UI/CustomTable';
import { Tabs } from 'antd';
import { Link, useParams } from 'react-router-dom';
import DoctorApiService from '../../../../service/DoctorApiService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import DashboardLayout from '../../../Common/Dashboard/DashboardLayout';
import PatientApiService from '../../../../service/PatientApiService';
import moment from 'moment';
import VitalSignChart from './VitalSignChart';
import ServiceResult from './ServiceResult';
import PrescriptionList from './PrescriptionList';
import swal from 'sweetalert';

const MedicalRecordGeneral = () => {
    const id = useParams();
    dayjs.extend(customParseFormat);
    dayjs.extend(isSameOrAfter);
    const [sortBy, setSortBy] = useState("upcoming");
    const [appointmentData, setAppointmentData] = useState([]);
    const [medicalRecordData, setMedicalRecordData] = useState([]);
    const [treatDetailData, setTreatDetailData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [patientData, setPatientData] = useState({});
    const [drugAllergy, setDrugAllergy] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [interactionText, setInteractionText] = useState('');
     // Hiển thị modal
     const showModal = () => {
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setInteractionText('');
    };

    // Hàm xử lý khi bấm Lưu
    const handleSave = async () => {
        try {
            const request = {
                patient: {
                    id: id.id
                }, 
                drugAllergy: interactionText
            }
            const response = await PatientApiService.addDrugAllergy(request);
            if (response.statusCode === 200) {
                // Clear the form fields after successful registration
                
                swal({
                    icon: 'success',
                    text: `Thêm thành công`,
                    timer: 2000
                })
                const dData = await DoctorApiService.getDrugAllergyByPatientId(id.id);
                setDrugAllergy(dData.drugAllergyList);
                setInteractionText('');
                setIsModalVisible(false);

            }
            
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };
      
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const pdata = await PatientApiService.getPatientById(id.id);
                const dData = await DoctorApiService.getDrugAllergyByPatientId(id.id);
                setDrugAllergy(dData.drugAllergyList);
                const apRequest = {
                    patient: {id: id.id},
                    status: "Treated"
                }
                const apData = await DoctorApiService.getAppointmentByPatientAndStatus(apRequest);
                setPatientData(pdata.patient);
                setAppointmentData(apData.appointmentList);
                // setAppointmentData(data.appointmentList);
                 // Xử lý lọc và sắp xếp
                 const today = dayjs().startOf('day');
                 const tomorrow = dayjs().add(1, 'day').startOf('day');
 
                 // Lọc danh sách cuộc hẹn hôm nay
                
                const appData = apData.appointmentList
                .sort((a, b) => 
                dayjs(b.appointmentTime, 'DD/MM/YYYY hh:mm A').diff(dayjs(a.appointmentTime, 'DD/MM/YYYY hh:mm A')) // Sắp xếp theo thời gian
                );
                 // Cập nhật state
                setAppointmentData(appData);
                const allData = await Promise.all(
                    appData.map(async (ap) => {
                        const mediData = await DoctorApiService.getMedicalRecord(ap.id);
                        return mediData.medicalRecord;
                    })
                );
                
                // Kết hợp dữ liệu từ tất cả các phần tử
                const medicalRecords = allData;
                const treatDetails = allData.flatMap(record => record.treatmentDetail);
                const services = allData.flatMap(record => record.treatmentServiceList);
                const prescriptions = allData.flatMap(record => record.prescriptionList);
                
                // Set lại các state với dữ liệu đầy đủ
                setMedicalRecordData(medicalRecords);
                setTreatDetailData(treatDetails);
                setServiceData(services);
                setPrescriptionData(prescriptions);
          } catch (error) {
            console.error("Error fetching appointment:", error);
          }
        };
    
        fetchAppointment();
      }, [id]);

    console.log("pppp=>", treatDetailData);
    console.log("aaaaa=>", prescriptionData);

    const handleOnselect = (value) => {
        // eslint-disable-next-line eqeqeq
        setSortBy(value == 1 ? 'upcoming' : value == 2 ? 'today' : sortBy)
    }

    const apHistoryColumns = [
        {
            title: 'Thời gian khám',
            key: '1',
            width: 70,
            render: function (treatDetailData) {
                return (
                    <div style={{ textAlign: 'left' }}>{treatDetailData.appointment.appointmentTime}</div>
                )
            }
        },
        {
            title: 'Chẩn đoán sơ bộ',
            key: '2',
            width: 80,
            render: function (treatDetailData) {
                return (
                    <div style={{ textAlign: 'left' }}>{treatDetailData.priliminaryDiagnosis}</div>
                )
            }
        },
        {
            title: 'Chẩn đoán xác định',
            key: '3',
            width: 80,
            render: function (treatDetailData) {
                return (
                    <div style={{ textAlign: 'left' }}>{treatDetailData.finallyDiagnosis}</div>
                )
            }
        },
        {
            title: 'Khám bộ phận',
            key: '4',
            width: 100,
            render: function (treatDetailData) {
                return (
                    <div style={{ textAlign: 'left' }}>
                        {treatDetailData.partExamination?.map((item, index) => (
                            <div key={index}>
                                {Object.entries(item).map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key}:</strong> {value}
                                    </p>
                                ))}
                            </div>
                        ))
                    }</div>
                )
            }
        },
        {
            title: 'Khám tổng quát',
            key: '5',
            width: 100,
            render: function (treatDetailData) {
                return (
                    <div style={{ textAlign: 'left' }}>
                        {treatDetailData.bodyExamination?.map((item, index) => (
                            <div key={index}>
                                {Object.entries(item).map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key}:</strong> {value}
                                    </p>
                                ))}
                            </div>
                        ))
                    }</div>
                )
            }
        },
        // {
        //     title: 'Trạng thái',
        //     key: '4',
        //     width: 100,
        //     render: function (appointmentData) {
        //         return (
        //             <div style={{ textAlign: 'left' }}>
        //                 <Tag color="#87d068" className='text-uppercase'>
        //                     {
        //                         appointmentData?.status === "Pending" 
        //                         ? "Chờ tiếp nhận" 
        //                         : appointmentData?.status === "Accepted" 
        //                         ? "Chấp nhận" 
        //                         : appointmentData?.status === "Pended" 
        //                         ? "Tiếp nhận" 
        //                         : appointmentData?.status === "Treated" 
        //                         ? "Đã khám"
        //                         : "Hủy"
        //                     }
        //                 </Tag>
        //             </div>
        //         )
        //     }
        // },
    ];

    const items = [
        {
            key: '1',
            label: 'Lịch sử khám bệnh',
            children: <CustomTable
                columns={apHistoryColumns}
                dataSource={treatDetailData}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
        {
            key: '2',
            label: 'Biểu đồ sinh hiệu',
            children: <VitalSignChart
                    treatDetailData = {treatDetailData}
            />,
        },
        {
            key: '3',
            label: 'Kết quả xét nghiệm',
            children: <ServiceResult
                    serviceData = {serviceData}
            />,
        },
        {
            key: '4',
            label: 'Đơn thuốc',
            children: <PrescriptionList
                prescriptionData={prescriptionData}
            />,
        },
        
    ];

    return (
        <DashboardLayout>
            <div className="invoice-item">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="invoice-info" >
                                    <div style={{marginBottom:'30px'}}>
                                        <strong className="customer-text" >THÔNG TIN BỆNH ÁN</strong>
                                    </div>
                                    <div className="invoice-details invoice-details-two">
                                        <div className="d-flex justify-content-between patient-name">
                                            <div>
                                                <h5 style={{ fontWeight: 700, marginBottom:'20px' }}>- Họ và tên: {patientData.user?.name}</h5>
                                                <div>
                                                    <h5 style={{ fontWeight: 700 }}>- Tiền sử bệnh án:</h5>
                                                    {
                                                        treatDetailData?.map((item, index) => (
                                                            item.medicalHistory?.map((his, hisIndex) => (
                                                                <p key={`${index}-${hisIndex}`} className="">+ {his}</p>
                                                            ))
                                                        ))
                                                    }
                                                </div>
                                                <div>
                                                    <div style={{display:'flex', width:'500px', justifyContent:'space-between'}}>
                                                        <h5 style={{ fontWeight: 700 }}>- Tương tác thuốc:</h5>
                                                        <div>
                                                            <Button type="primary" size="small" htmlType="button" block icon={<FaPlus />} onClick={showModal}>
                                                                Thêm tương tác thuốc
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {
                                                        drugAllergy?.map((item, index) => (
                                                            <>
                                                            {/* <p key={`${index}`} className="">+ {item.drugAllergy}</p> */}
                                                            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'Poppins, sans-serif', fontSize: '16px'  }}>
                                                                + {item.drugAllergy}
                                                            </pre>
                                                            </>
                                                        ))
                                                    }
                                                    <Modal
                                                        title="Bổ sung tương tác thuốc của bệnh nhân"
                                                        open={isModalVisible}
                                                        onCancel={handleCancel}
                                                        footer={[
                                                            <Button key="cancel" onClick={handleCancel}>
                                                                Hủy
                                                            </Button>,
                                                            <Button key="save" type="primary" onClick={handleSave}>
                                                                Lưu
                                                            </Button>,
                                                        ]}
                                                    >
                                                        <Input.TextArea
                                                            rows={4}
                                                            value={interactionText}
                                                            onChange={(e) => setInteractionText(e.target.value)}
                                                            placeholder="Nhập thông tin tương tác thuốc..."
                                                        />
                                                    </Modal>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            <Tabs defaultActiveKey="1" items={items} onChange={handleOnselect} />
        </DashboardLayout>
    )
}

export default MedicalRecordGeneral;