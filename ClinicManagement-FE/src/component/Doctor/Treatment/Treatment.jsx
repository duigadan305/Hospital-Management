import DashboardLayout from "../../Common/Dashboard/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Steps } from "antd";
import { useEffect, useState } from "react";
import TreatmentStep1 from "./TreatmentStep1";
import './index.css';
import TreatmentStep2 from "./TreatmentStep2";
import TreatmentStep3 from "./TreatmentStep3";
import DoctorApiService from "../../../service/DoctorApiService";
import { useLocation } from 'react-router-dom';
import swal from "sweetalert";
const Treatment = () => {
    const { id } = useParams();
    const location = useLocation(); 
    const [serviceData, setServiceData] = useState([]);
    const [treatDetail, setTreatDetail] = useState({});
    const [prescript, setPrescript] = useState([]);

    const getTreatmentDetail = async () => {
          try {
              const dataa = await DoctorApiService.getTreatmentDetail(id);
              setTreatmentDetail(dataa.treatmentDetail);
              console.log("detail=>", dataa.treatmentDetail);
          } catch (error) {
              console.error("Error fetching appointment:", error);
          }
    };
    useEffect(() => {
      getTreatmentDetail();
    }, [id, location]);
    const [current, setCurrent] = useState(0);
    const next = () => { setCurrent(current + 1) };
    const prev = () => { setCurrent(current - 1) };
    const [treatmentDetail, setTreatmentDetail] = useState({});

    const steps = [
        {
          content: <TreatmentStep1
          key={`step-1-${id}`}
          treatmentDetail={treatmentDetail}       
          />
        },
        {
          content: <TreatmentStep2 
          key={`step-2-${id}`}
          treatmentDetail={treatmentDetail}
          />
        },
        {
            content: <TreatmentStep3
            key={`step-3-${id}`}
            treatmentDetail={treatmentDetail}
            serviceData={serviceData}
            setServiceData={setServiceData}
            treatDetail={treatDetail}
            setTreatDetail={setTreatDetail}
            prescript={prescript}
            setPrescript={setPrescript}
            />
          }          
      ]
    
      const items = steps.map((item) => ({
        key: item.title
      }))
    
      
      console.log("servicee=>", serviceData);
      console.log("treattt=>", treatDetail);
      console.log("pressss=>", prescript);

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response1 = await DoctorApiService.treatAppointmentStep2(treatDetail);
            // console.log("apData===>", apData)
            for(const service of serviceData){
              console.log("seeee", service);
              const formData = new FormData();
              formData.append("treatmentServiceDTO", service);
              if (service.file) {
                formData.append("file", service.file);
              }

              const response2 = await DoctorApiService.treatAppointmentServiceStep2(formData);
            }
            for(const pres of prescript){
              console.log("preeee1", pres);
              const response3 = await DoctorApiService.treatAppointmentPresciption(pres);
            }
            if (response1.statusCode === 200) {
                // Clear the form fields after successful registration
                
                swal({
                    icon: 'success',
                    text: `Kết thúc khám`,
                    timer: 2000
                })
                setCurrent(0);
            }
        
        }
         catch (error) {
        }
      }

    return (
        <DashboardLayout>
            {/* <TreatmentOverview data={data} /> */}
            <Steps current={current} items={items} />
          <div >{steps[current].content}</div>
          <div className='text-end mx-3' >
            {current < steps.length - 1 && (
              <Button type="primary" size="large"
                onClick={() => next()}>Tiếp tục</Button>)}

            {/* {current === steps.length - 1 && (<Button type="primary" size="large"onClick={handleSubmit}>Kết thúc khám</Button>)} */}
            {current > 0 && (<Button style={{ margin: '0 8px', }} size="large" onClick={() => prev()} >Quay lại</Button>)}
          </div>
        </DashboardLayout>
    )
}

export default Treatment;