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
import TreatmentOverview from "./TreatmentOverview";
import './index.css';
import swal from "sweetalert";
import DoctorApiService from "../../../service/DoctorApiService";
import useAuthCheck from "../../../service/useAuthCheck";

const TreatmentStep1 = ({treatmentDetail}) => {
    // const { authChecked, uData } = useAuthCheck();
    const navigate = useNavigate();
    const { id } = useParams();
    const { handleSubmit } = useForm();
    // const data = treatmentDetail.treatmentDetail;
    const [data, setData] = useState({});
    
    const getTreatmentDetail = async () => {
        try {
            const dataa = await DoctorApiService.getTreatmentDetail(treatmentDetail.appointment.id);
            setData(dataa.treatmentDetail);
        } catch (error) {
            console.error("Error fetching appointment:", error);
        }
    };
    useEffect(() => {
        getTreatmentDetail();
    }, [id]);
    console.log("detail=>", data);
    const [reason, setReason] = useState(treatmentDetail.reason);
    // const [medicalHistory, setMedicalHistory] = useState(treatmentDetail.medicalHistory || {});
    const [bodyExamination, setBodyExamination] = useState(treatmentDetail.bodyExamination || []);
    const [partExamination, setPartExamination] = useState(treatmentDetail.partExamination || []);
    const [vitalSign, setVitalSign] = useState(() => {
        const savedData = sessionStorage.getItem("vitalSign");
        return savedData ? JSON.parse(savedData) : treatmentDetail.vitalSign || {};
    });
    const [priliminaryDiagnosis, setPriliminaryDiagnosis] = useState(treatmentDetail?.priliminaryDiagnosis || "");
    const [diseaseCode, setDiseaseCode] = useState(() => {
        const savedData = sessionStorage.getItem("diseaseCode");
        return savedData ? (savedData) : "";
    });
    useEffect(() => {
        sessionStorage.setItem("diseaseCode", diseaseCode);
    }, [diseaseCode]);
    const [diseaseName, setDiseaseName] = useState(() => {
        const savedData = sessionStorage.getItem("diseaseName");
        return savedData ? (savedData) : "";
    });
    useEffect(() => {
        sessionStorage.setItem("diseaseName", diseaseName);
    }, [diseaseName]);
    
    // Tách chuỗi và lưu vào state
    useEffect(() => {
        if (priliminaryDiagnosis) {
            const [code, name] = priliminaryDiagnosis.split("-");
            setDiseaseCode(code || "");
            setDiseaseName(name || "");
        }
    }, [priliminaryDiagnosis]);

    const [medicalHistoryList, setMedicalHistoryList] = useState(() => {
        const savedData = sessionStorage.getItem("medicalHistoryList");
        return savedData
            ? JSON.parse(savedData)
            : treatmentDetail.medicalHistory?.map((item, index) => ({ id: index + 1, value: item })) || [{ id: 1, value: '' }];
    });
    console.log("medii=>", medicalHistoryList);
    const [bodyExaminationList, setBodyExaminationList] = useState(() => {
        const savedList = sessionStorage.getItem('bodyExaminationList');
        return savedList
            ? JSON.parse(savedList)
            : treatmentDetail.bodyExamination?.map((item, index) => {
                  const [name, value] = Object.entries(item)[0];
                  return { id: index + 1, name, value };
              }) || [];
    });
    
    const [partExaminationList, setPartExaminationList] = useState(() => {
        const savedList = sessionStorage.getItem('partExaminationList');
        return savedList
            ? JSON.parse(savedList)
            : treatmentDetail.partExamination?.map((item, index) => {
                  const [name, value] = Object.entries(item)[0];
                  return { id: index + 1, name, value };
              }) || [];
    });

    //medicalHistory
    const addMedicalHistoryList = (e) => {
        e.preventDefault();
        setMedicalHistoryList([...medicalHistoryList, { id: medicalHistoryList.length + 1, value: '' }]);
    };
    
    const removeMedicalHistoryList = (id) => {
        setMedicalHistoryList(medicalHistoryList.filter((item) => item.id !== id));
    };

    const updateMedicalHistory = (id, newValue) => {
        setMedicalHistoryList(
            medicalHistoryList.map((item) => (item.id === id ? { ...item, value: newValue } : item))
        );
    };
    useEffect(() => {
        sessionStorage.setItem("medicalHistoryList", JSON.stringify(medicalHistoryList));
    }, [medicalHistoryList]);

    //body exam
    const addBodyExaminationItem = () => {
        const newId = bodyExaminationList.length + 1;
        setBodyExaminationList([
            ...bodyExaminationList,
            { id: newId, name: "", value: "" },
        ]);
    };
    
    
    const removeBodyExaminationItem = (id) => {
        setBodyExaminationList((prev) => prev.filter((item) => item.id !== id));
    };
    
    const updateBodyExamination = (id, newName, newValue) => {
        setBodyExaminationList(prevList =>
            prevList.map(item => 
                item.id === id 
                    ? { ...item, name: newName, value: newValue } // cập nhật tên và kết quả
                    : item
            )
        );
    };

    useEffect(() => {
        sessionStorage.setItem('bodyExaminationList', JSON.stringify(bodyExaminationList));
    }, [bodyExaminationList]);
    
    //part exam
    const addPartExaminationItem = () => {
        const newId = partExaminationList.length + 1;
        setPartExaminationList([
            ...partExaminationList,
            { id: newId, name: "", value: "" },
        ]);
    };

    const removePartExaminationItem = (id) => {
        setPartExaminationList((prev) => prev.filter((item) => item.id !== id));
    };

    const updatePartExamination = (id, newName, newValue) => {
        setPartExaminationList(prevList =>
            prevList.map(item => 
                item.id === id 
                    ? { ...item, name: newName, value: newValue } // cập nhật tên và kết quả
                    : item
            )
        );
    };

    useEffect(() => {
        sessionStorage.setItem('partExaminationList', JSON.stringify(partExaminationList));
    }, [partExaminationList]);

    //save data
    const saveTreatmentData = async (e) => {
        e.preventDefault();
        const priDiagnosis = `${diseaseCode} - ${diseaseName}`;
        const formattedMedicalHistory = medicalHistoryList.map(item => item.value);
        const formattedBodyExamination = bodyExaminationList.map(item => ({
            [item.name]: item.value // Sử dụng dynamic key để tạo object với key là 'name' và value là 'value'
        }));
        const formattedPartExamination = partExaminationList.map(item => ({
            [item.name]: item.value // Sử dụng dynamic key để tạo object với key là 'name' và value là 'value'
        }));
        const tmData = {
            reason: reason,
            medicalHistory: formattedMedicalHistory,
            vitalSign: vitalSign,
            bodyExamination: formattedBodyExamination,
            partExamination: formattedPartExamination,
            priliminaryDiagnosis: priDiagnosis,
            appointment: {
                id: id
            }
      };
        try {
            // Call the register method from ApiService
            console.log("apData===>", tmData)
            const response = await DoctorApiService.treatAppointmentStep1(tmData);
            // Check if the response is successful
            if (response.statusCode === 200) {
                // Clear the form fields after successful registration
                
                swal({
                    icon: 'success',
                    text: `Lưu thành công`,
                    timer: 2000
                })
            }
        
        }
         catch (error) {
        }
    }

    //Vital sign
    useEffect(() => {
        sessionStorage.setItem("vitalSign", JSON.stringify(vitalSign));
    }, [vitalSign]);

    const changeVitalSign = (e) => {
        const { name, value } = e.target;
        setVitalSign((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    console.log("vitalll=>", vitalSign);

    return (
            <div className="w-100 mb-3 rounded p-3 bg-gray-g">
                <div className="text-center mb-2 d-flex justify-content-center">
                    <h5 className="border-success border-bottom w-25 pb-2 border-5">Kết quả khám bệnh</h5>
                </div>

                <form className="row form-row">
                <div className="col-md-12 mb-3">
                        <div className="form-group mb-2">
                            <span style={{textAlign: 'left'}}>Lý do đến khám</span>
                            <TextArea value={data.reason} rows={4} placeholder="" onChange={(e) => setReason(e.target.value)} />
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Bệnh sử</h6>
                            {
                                medicalHistoryList?.map((item) => (
                                    <div className="" key={item.id}>
                                        <div className="col-md-8 mb-3">
                                            <div className="form-group mb-2" style={{display: 'flex'}}>
                                                <input defaultValue={item.value} 
                                                 onChange={(e) => updateMedicalHistory(item.id, e.target.value)}
                                                className="form-control" />
                                                <a className="text-danger text-end mb-3"
                                                    onClick={() => removeMedicalHistoryList(item?.id)} style={{ marginLeft: '15px' }}>
                                                    <FaRegTrashAlt />
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            }
                                        <div className="mb-4" style={{ width: '120px' }}>
                                            <Button type="primary" size='small' htmlType="button" onClick={addMedicalHistoryList} block icon={<FaPlus />}>
                                                Add
                                            </Button>
                                        </div>
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 style={{marginBottom:'30px'}} className="card-title text-secondary">Dấu hiệu sinh tồn</h6>
                            <div className="row form-row">

                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Mạch</label>
                                        <input name="pulse" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.pulse} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(bpm)</span>
                                                    
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Nhiệt độ</label>
                                        <input name="temperature" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.temperature} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(°C)</span>            
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Huyết áp</label>
                                        <input name="bloodPressure" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.bloodPressure} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(mmHg)</span>            
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Chỉ số Oxy</label>
                                        <input name="oxygen" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.oxygen} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(%)</span>            
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Chiều cao</label>
                                        <input name="height" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.height} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(cm)</span>            
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Cân nặng</label>
                                        <input name="weight" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.weight} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(kg)</span>            
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Nhịp thở</label>
                                        <input name="respiratoryRate" style={{marginRight: '10px', marginLeft:'10px', width:'200px'}} 
                                        defaultValue={vitalSign.respiratoryRate} 
                                        onChange={changeVitalSign}
                                        className="form-control"/>
                                        <span style={{color:'blueviolet'}}>(bpm)</span>            
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Khám toàn thân</h6>
                            {bodyExaminationList.map((item) => (
                                <div className="col-md-8 mb-3" key={item.id}>
                                    <div className="form-group mb-2" style={{ display: 'flex' }}>
                                        <input
                                            placeholder="Tên mục"
                                            style={{ width: '150px', marginRight: '20px' }}
                                            defaultValue={item.name}
                                            onChange={(e) => updateBodyExamination(item.id, e.target.value, item.value)}
                                            className="form-control"
                                        />
                                        <input
                                            placeholder="Kết quả"
                                            defaultValue={item.value}
                                            onChange={(e) => updateBodyExamination(item.id, item.name, e.target.value)}
                                            className="form-control"
                                        />
                                        <a
                                            className="text-danger text-end mb-3"
                                            onClick={() => removeBodyExaminationItem(item.id)}
                                            style={{ marginLeft: '15px' }}
                                        >
                                            <FaRegTrashAlt />
                                        </a>
                                    </div>
                                </div>
                            ))}     
                                        <div className="mb-4" style={{ width: '120px' }}>
                                            <Button type="primary" size='small' htmlType="button" onClick={addBodyExaminationItem} block icon={<FaPlus />}>
                                                Add
                                            </Button>
                                        </div>
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 className="card-title text-secondary">Khám bộ phận</h6>
                            {
                                partExaminationList?.map((item) => (
                                    <div className="" key={item.id}>
                                        <div className="col-md-8 mb-3">
                                            <div className="form-group mb-2" style={{display: 'flex'}}>
                                            <input
                                                placeholder="Tên mục"
                                                style={{ width: '150px', marginRight: '20px' }}
                                                defaultValue={item.name}
                                                onChange={(e) => updatePartExamination(item.id, e.target.value, item.value)}
                                                className="form-control"
                                            />
                                                <input
                                                    placeholder="Kết quả"
                                                    defaultValue={item.value}
                                                    onChange={(e) => updatePartExamination(item.id, item.name, e.target.value)}
                                                    className="form-control"
                                                />
                                                <a className="text-danger text-end mb-3"
                                                    onClick={() => removePartExaminationItem(item?.id)} style={{ marginLeft: '15px' }}>
                                                    <FaRegTrashAlt />
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            }
                                        <div className="mb-4" style={{ width: '120px' }}>
                                            <Button type="primary" size='small' htmlType="button" onClick={addPartExaminationItem} block icon={<FaPlus />}>
                                                Add
                                            </Button>
                                        </div>
                        </div>

                        <div className="card mb-2 p-3 mt-2">
                            <h6 style={{marginBottom:'30px'}} className="card-title text-secondary">Chẩn đoán sơ bộ</h6>
                            <div className="row form-row">

                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Mã bệnh</label>
                                        <input 
                                            style={{marginRight: '10px', marginLeft:'10px'}} 
                                            defaultValue={diseaseCode} 
                                            onChange={(e) => setDiseaseCode(e.target.value)} 
                                            className="form-control"/>
                                        
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-2" style={{display: 'flex'}}>
                                        <label style={{width:'100px'}}>Tên bệnh</label>
                                        <input 
                                            style={{marginRight: '10px', marginLeft:'10px'}} 
                                            defaultValue={diseaseName} 
                                            onChange={(e) => setDiseaseName(e.target.value)} 
                                            className="form-control"/> 
                                        
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="" style={{textAlign: 'center' }}>
                        <Button type="primary" htmlType="button" onClick={saveTreatmentData}>
                            Lưu
                        </Button>
                    </div>
                </form>
            </div>
    )
}

export default TreatmentStep1;