import { useState } from "react";
import Footer from "../../Common/Footer/Footer";
import Header from "../../Common/Header/Header";
import BookingConfirm from "./BookingConfirm";
import PersonalInformation from "./PersonalInformation";
import { Button, Steps } from "antd";
import SelectApppointment from "./SelectApppointment";
import { useParams } from "react-router-dom";
import PatientApiService from "../../../service/PatientApiService";
import swal from 'sweetalert';

let initialValue = {
  paymentMethod: 'paypal',
  paymentType: 'creditCard',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reasonForVisit: '',
  description: '',
  address: '',
  nameOnCard: '',
  cardNumber: '',
  expiredMonth: '',
  cardExpiredYear: '',
  cvv: '',
}
const AppointmentPage = () => {
  const [current, setCurrent] = useState(0);
  const [selectTime, setSelectTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [patientData, setPatientData] = useState({});

  const doctorId = useParams();

  console.log("id bsi==>", doctorId.doctorId);

  const next = () => { setCurrent(current + 1) };
  const prev = () => { setCurrent(current - 1) };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    const apData = {
      patient: patientData,
      doctor: { id: selectedDoctor },
      appointmentTime: selectTime,
      reason: reason
    };
    try {
        // Call the register method from ApiService
        const response = await PatientApiService.bookAppointment(apData);
        console.log("apData===>", apData)
        // Check if the response is successful
        if (response.statusCode === 200) {
            // Clear the form fields after successful registration
            
            swal({
                icon: 'success',
                text: `Đặt lịch hẹn thành công`,
                timer: 5000
            })
            setCurrent(0);
        }
    
    }
     catch (error) {
    }
  }

  const steps = [
    {
      title: 'Chọn thời gian hẹn khám',
      content: <SelectApppointment
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectTime={selectTime}
        setSelectTime={setSelectTime}
        doctorId={doctorId.doctorId}
      />
    },
    {
      title: 'Thông tin bệnh nhân',
      content: <PersonalInformation 
      patientData={patientData} 
      setPatientData={setPatientData}
      reason={reason}
      setReason={setReason}
      />
    },
    {
      title: 'Xác nhận lịch hẹn',
      content: <BookingConfirm
        patientData={patientData}
        setPatientData={setPatientData}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectTime={selectTime}
        setSelectTime={setSelectTime}
        reason={reason}
        setReason={setReason}
      />,
    },
  ]
  console.log("appodata=>",selectedDoctor," ",selectTime);
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }))

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '8rem', bottom: '5rem' }}>
        <div className="container" style={{ marginBottom: '12rem', marginTop: '8rem' }}>
          <Steps current={current} items={items} />
          <div className='mb-5 mt-3 mx-3'>{steps[current].content}</div>
          <div className='text-end mx-3' >
            {current < steps.length - 1 && (
              <Button type="primary" size="large"
                disabled={current === 0 ? ((selectedDoctor && selectTime) ? false : true) : (patientData ? false : true) || !selectTime}
                onClick={() => next()}>Tiếp</Button>)}

            {current === steps.length - 1 && (<Button type="primary" size="large" onClick={handleConfirmSchedule}>Xác nhận</Button>)}
            {current > 0 && (<Button style={{ margin: '0 8px', }} size="large" onClick={() => prev()} >Quay lại</Button>)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AppointmentPage