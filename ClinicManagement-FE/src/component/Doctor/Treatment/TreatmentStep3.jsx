import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { Button, DatePicker, Space, message } from "antd";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { DatePickerSinglePresets, DiagnosisOptions, DiseaseOptions, DosageOptions, FrequencyOptions, MedicalCheckupOptions, PatientStatus, appointemntStatusOption } from "../../../service/global";
import SelectForm from "../../Common/UI/SelectForm";
import TextArea from "antd/es/input/TextArea";
// import InputAutoCompleteForm from "../../UI/form/InputAutoCompleteForm";
import { useForm } from "react-hook-form";
// import SelectFormForMedicine from "../../UI/form/SelectFormForMedicine";
// import MedicineRangePickerForm from "../../UI/form/MedicineRangePickerForm";
import DoctorApiService from "../../../service/DoctorApiService";
import './index.css';
import swal from "sweetalert";

const TreatmentStep3 = ({treatmentDetail, serviceData, setServiceData, treatDetail, setTreatDetail, prescript, setPrescript}) => {
    const [examServiceList, setExamServiceList] = useState([]);
    const [drugAllergyList, setDrugAllergyList] = useState([]);
    const [fileUploads, setFileUploads] = useState({});
    const [filteredServiceList, setFilteredServiceList] = useState([]); // Biến mới chứa id, result và file
    const navigate = useNavigate();
    const getTreatmentService = async () => {
        try {
            const dataa = await DoctorApiService.getTreatmentService(treatmentDetail.appointment.id);
            setExamServiceList(dataa.treatmentServiceList);
            const newServiceList = dataa.treatmentServiceList.map(service => ({
                id: service.id,
                result: service.result,
                file: null // Ban đầu chưa có file
            }));
            
            setFilteredServiceList(newServiceList);
            console.log("servicess=>", dataa.treatmentServiceList);
        } catch (error) {
            console.error("Error fetching service:", error);
        }
    };
  useEffect(() => {
    getTreatmentService();
  }, [treatmentDetail]);

  const getDrugAllergy = async () => {
        try {
            const dataa = await DoctorApiService.getDrugAllergyByPatientId(treatmentDetail.appointment.patient.id);
            setDrugAllergyList(dataa.drugAllergyList);
            console.log("druggg=>", dataa.drugAllergyList);
        } catch (error) {
            console.error("Error fetching service:", error);
        }
    };
    useEffect(() => {
        getDrugAllergy();
    }, [treatmentDetail]);

    const [finallyDiagnosis, setFinallyDiagnosis] = useState("");
    const [diseaseCode, setDiseaseCode] = useState("");
    const [diseaseName, setDiseaseName] = useState("");
    const [selectedDirection, setSelectedDirection] = useState(''); // Quản lý giá trị của select
    const [followUpDate, setFollowUpDate] = useState(0);
    const [prescriptionList, setPrescriptionList] = useState([{ id: 1, drugName: '', dosage: '', quantity: '', unit: '', usageInstruction: '', appointment: {id: treatmentDetail.appointment.id} }]);

    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        const updatedList = [...examServiceList];
        updatedList[index].file = file; // Thêm thuộc tính uploadedFile vào phần tử
        setExamServiceList(updatedList); // Nếu có setExamServiceList

        // Cập nhật filteredServiceList để chỉ giữ id, result và file
        const updatedFilteredList = [...filteredServiceList];
        updatedFilteredList[index].file = file; // Cập nhật file tại vị trí index
        setFilteredServiceList(updatedFilteredList);
      };
      const handleResult = (e, index) => {
        const updatedList = [...examServiceList];
        const updatedFilteredList = [...filteredServiceList];
        updatedList[index].result = e.target.value; // Thêm thuộc tính uploadedFile vào phần tử
        updatedFilteredList[index].result = e.target.value;
        setExamServiceList(updatedList); // Nếu có setExamServiceList
        setFilteredServiceList(updatedFilteredList);
      };

      const handleDirectionChange = (e) => {
        setSelectedDirection(e.target.value);
      };
    
    // console.log("treatservvv=>", examServiceList);

    const addPrescriptionList = (e) => {
        e.preventDefault();
        setPrescriptionList([...prescriptionList, { id: prescriptionList.length + 1, drugName: '', dosage: '', quantity: '', unit: '', usageInstruction: '', appointment: {id: treatmentDetail.appointment.id}}]);
      };

    const removePrescriptionList = (id) => {
        setPrescriptionList(prescriptionList.filter((item) => item.id !== id))
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedList = [...prescriptionList];
        updatedList[index][name] = value; // Cập nhật giá trị cho đúng trường dữ liệu
        setPrescriptionList(updatedList);
    };

    
    useEffect(() => {
        setServiceData(filteredServiceList);
        setTreatDetail({
            appointment: {
                id: treatmentDetail.appointment.id
            },
            prescriptionType: selectedDirection,
            followUpDate: followUpDate,
            finallyDiagnosis: `${diseaseCode}-${diseaseName}`,
        });
        setPrescript(prescriptionList);
    }, [treatmentDetail, examServiceList, diseaseCode, diseaseName, prescriptionList, selectedDirection, followUpDate, filteredServiceList]);
    
    console.log("presss3=>", prescript);
    console.log("serr3=>", filteredServiceList);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("treattt=>", treatDetail);
            const response1 = await DoctorApiService.treatAppointmentStep2(treatDetail);
            // console.log("apData===>", apData)
            for(const service of filteredServiceList){
                const formData = new FormData();
                formData.append("id", service.id);
                formData.append("result", service.result);
                if (service.file) {
                    formData.append("file", service.file); // Chỉ thêm nếu có file
                }
    
                console.log("FormData:", formData.get("file"));
                console.log("FormDataid:", formData.get("id"));
                console.log("FormDatares:", formData.get("result"));
                
                const response2 = await DoctorApiService.treatAppointmentServiceStep2(formData);
            }
            for(const pres of prescript){
              console.log("preeee3", pres);
              const response3 = await DoctorApiService.treatAppointmentPresciption(pres);
            }
            if (response1.statusCode === 200) {
                // Clear the form fields after successful registration
                
                swal({
                    icon: 'success',
                    text: `Kết thúc khám`,
                    timer: 2000
                }).then(() => {
                    navigate('/dashboard'); // Điều hướng về trang login
                });
            }
        
        }
         catch (error) {
        }
      }
    
    return (
            <div className="w-100 mb-3 rounded p-3 bg-gray-g">
                <div className="text-center mb-2 d-flex justify-content-center">
                    <h5 className="border-success border-bottom w-25 pb-2 border-5">Kết quả khám bệnh</h5>
                </div>

                <form className="row form-row">
                <div className="col-md-12 mb-3">                   

                <div className="card mb-2 p-3 mt-2">
                    <h6 className="card-title text-secondary">Kết quả xét nghiệm</h6>
                    {examServiceList?.map((item, index) => (
                        <div className="card mb-2 p-3 mt-2" key={index}>
                        {/* Tên xét nghiệm và Tải file lên */}
                        <div className="form-group d-flex align-items-center mb-3">
                            <label className="me-3" style={{ width: '150px' }}>Tên xét nghiệm:</label>
                            <input
                            type="text"
                            
                            defaultValue={item.service.name}
                            className="form-control me-3"
                            style={{ flex: 1 }}
                            />
                            <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleFileUpload(e, index)}
                            style={{ width: '450px' }}
                            />
                        </div>

                        {/* Hiển thị tên file đã upload */}
                        {fileUploads[index] && (
                            <p className="text-success mt-1">
                            Đã chọn file: {fileUploads[index].name}
                            </p>
                        )}

                        {/* Nhận xét */}
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label style={{ width: '110px', marginRight: '75px' }}>Nhận xét:</label>
                            <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Nhập nhận xét..."
                            onChange={(e) => handleResult(e, index)}
                            />
                        </div>
                        </div>
                    ))}
                </div>             

                        <div className="card mb-2 p-3 mt-2">
                            <h6 style={{marginBottom:'30px'}} className="card-title text-secondary">Chẩn đoán xác định</h6>
                            <div className="row form-row">

                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Mã bệnh</label>
                                        <input  onChange={(e) => setDiseaseCode(e.target.value)}  style={{marginRight: '10px', marginLeft:'10px'}} defaultValue='' className="form-control"/>
                                        
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Tên bệnh</label>
                                        <input onChange={(e) => setDiseaseName(e.target.value)}  style={{marginRight: '10px', marginLeft:'10px'}} defaultValue='' className="form-control"/> 
                                        
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Phương hướng điều trị</h6>
                            <div form-group mb-2 style={{display: 'flex'}}>
                                <label style={{width:'200px'}} className="mb-2">Chọn hướng điều trị:</label>
                                <select
                                    style={{width:'300px'}}
                                    className="form-control mb-3"
                                    value={selectedDirection}
                                    onChange={handleDirectionChange}
                                >
                                    <option value="">Chọn</option>
                                    <option value="KDCV">Kê đơn cho về</option>
                                    <option value="KDTK">Kê đơn cho về và hẹn tái khám</option>
                                    <option value="DNNV">Đề nghị nhập viện</option>
                                    <option value="KCKD">Không kê đơn</option>
                                </select>
                                {selectedDirection === 'KDTK' && (
                                    <>
                                    <label style={{width:'200px', marginLeft: '50px'}} className="mb-2">Số ngày hẹn khám lại:</label>
                                    <input
                                        style={{ width: '70px' }}
                                        defaultValue=''
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                        className="form-control mb-3"
                                    />
                                    </>
                                )}
                            </div>

                            {(selectedDirection === 'KDCV' || selectedDirection === 'KDTK') && (
                                <>
                                    <div style={{display:'flex', width:'500px', justifyContent:'space-between'}}>
                                        <h5 style={{ fontWeight: 700, color:'red' }}>- Cảnh báo bệnh nhân có tiền sử:</h5>
                                    </div>
                                    {
                                        drugAllergyList?.map((item, index) => (
                                            <>
                                                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'Poppins, sans-serif', fontSize: '16px', marginLeft:'10px', fontStyle:'italic' }}>
                                                    {item.drugAllergy}
                                                </pre>
                                            </>
                                        ))
                                    }
                                {prescriptionList.map((item, index) => (
                                    <div key={item.id}>
                                    <div className="card mb-2 p-3 mt-2">
                                        <div className="form-group mb-2 d-flex">
                                            <input
                                                placeholder="Tên thuốc"
                                                name="drugName"
                                                style={{ width: '300px', marginRight: '20px' }}
                                                defaultValue={item.drugName}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className="form-control"
                                            />
                                            <input
                                                placeholder="Hàm lượng"
                                                name="dosage"
                                                style={{ width: '150px', marginRight: '20px' }}
                                                defaultValue={item.dosage}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className="form-control"
                                            />
                                            <input
                                                placeholder="Số lượng"
                                                name="quantity"
                                                style={{ width: '150px', marginRight: '20px' }}
                                                defaultValue={item.quantity}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className="form-control"
                                            />
                                            <input
                                                placeholder="Đơn vị"
                                                name="unit"
                                                style={{ width: '150px', marginRight: '20px' }}
                                                defaultValue={item.unit}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-2 d-flex">
                                        <textarea
                                            style={{ width: '810px' }}
                                            name="usageInstruction"
                                            className="form-control"
                                            defaultValue={item.usageInstruction}
                                            onChange={(e) => handleInputChange(e, index)}
                                            rows="3"
                                            placeholder="Cách sử dụng"
                                            />
                                        </div>
                                            <a
                                                className="text-danger text-end mb-3"
                                                onClick={() => removePrescriptionList(item.id)}
                                                style={{ marginLeft: '15px', cursor: 'pointer' }}
                                            >
                                                <FaRegTrashAlt />
                                            </a>
                                    </div>
                                    </div>
                                ))}

                                <div className="mb-4" style={{ width: '120px' }}>
                                    <Button type="primary" size="small" htmlType="button" onClick={addPrescriptionList} block icon={<FaPlus />}>
                                    Thêm 
                                    </Button>
                                </div>
                                </>
                            )}
                        </div>

                    </div>
                    <div className="" style={{textAlign: 'center' }}>
                        <Button type="primary" htmlType="button" onClick={handleSubmit}>
                            Kết thúc khám
                        </Button>
                    </div>
                </form>
            </div>
    )
}

export default TreatmentStep3;