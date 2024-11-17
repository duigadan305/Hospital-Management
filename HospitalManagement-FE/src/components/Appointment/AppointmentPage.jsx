import { useEffect, useState } from "react";
import Footer from "../Shared/Footer/Footer";
import Header from "../Shared/Header/Header";
import CheckoutPage from "../Booking/BookingCheckout/CheckoutPage";
import PersonalInformation from "../Booking/PersonalInformation";
import { Button, Steps, message } from "antd";
import SelectApppointment from "./SelectApppointment";
import useAuthCheck from "../../redux/hooks/useAuthCheck";
import { useCreateAppointmentByUnauthenticateUserMutation } from "../../redux/api/appointmentApi";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../redux/feature/invoiceSlice";
import { useNavigate } from "react-router-dom";
import PatientApiService from "../../service/PatientApiService";
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
  const dispatch = useDispatch();
  const {data, role} = useAuthCheck();
  const [current, setCurrent] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [IsDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [patientData, setPatientData] = useState({});
  const navigation = useNavigate();

  const [createAppointmentByUnauthenticateUser, {data: appointmentData, isError, isSuccess, isLoading, error}] = useCreateAppointmentByUnauthenticateUserMutation()

  const handleChange = (e) => { setSelectValue({ ...selectValue, [e.target.name]: e.target.value }) };

  const next = () => { setCurrent(current + 1) };
  const prev = () => { setCurrent(current - 1) };

  useEffect(() => {
    const { firstName, lastName, email, phone, nameOnCard, cardNumber, expiredMonth, cardExpiredYear, cvv, reasonForVisit } = selectValue;
    const isInputEmpty = !firstName || !lastName || !email || !phone || !reasonForVisit;
    const isConfirmInputEmpty = !nameOnCard || !cardNumber || !expiredMonth || !cardExpiredYear || !cvv || !isCheck;
    setIsDisable(isInputEmpty);
    setIsConfirmDisable(isConfirmInputEmpty);
  }, [selectValue, isCheck]);
  

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

  useEffect(() => {
    if (isSuccess) {
        message.success("Succcessfully Appointment Scheduled")
        setSelectValue(initialValue);
        dispatch(addInvoice({ ...appointmentData }))
        navigation(`/booking/success/${appointmentData?.id}`)
    }
    if (isError) {
        message.error(error?.data?.message);
    }
}, [isSuccess, isError, isLoading, appointmentData])


  const steps = [
    {
      title: 'Chọn thời gian hẹn khám',
      content: <SelectApppointment
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectTime={selectTime}
        setSelectTime={setSelectTime}
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
      content: <CheckoutPage
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
                onClick={() => next()}>Next</Button>)}

            {current === steps.length - 1 && (<Button type="primary" size="large" loading={isLoading} onClick={handleConfirmSchedule}>Confirm</Button>)}
            {current > 0 && (<Button style={{ margin: '0 8px', }} size="large" onClick={() => prev()} >Previous</Button>)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AppointmentPage