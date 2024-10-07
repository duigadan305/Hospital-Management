import { Button } from 'antd'
import moment from 'moment';
import './index.css';
import { doctorTimeSlot } from '../../constant/global';
import { FaBriefcase, FaRegClock, FaLocationArrow, FaLink, FaCalendarAlt } from "react-icons/fa";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SelectApppointment = ({ selectedDate,setSelectedDate, handleDateChange, selectTime, setSelectTime }) => {
    const handleSelectTime = (date) => { setSelectTime(date) }
    const [specialties, setSpecialties] = useState([
        {id: 1, name: 'Chuyên khoa A'},
        {id: 2, name: 'Chuyên khoa B'},
        {id: 3, name: 'Chuyên khoa C'}
        ]); // Chứa danh sách chuyên khoa
    const [doctors, setDoctors] = useState([{id: 1, name: 'Bác sĩ A'}, {id: 2, name: 'Bác sĩ B'}]); // Chứa danh sách bác sĩ dựa trên chuyên khoa đã chọn
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    // useEffect(() => {
    //     axios.get('/api/specialties')
    //         .then(response => {
    //             setSpecialties(response.data); 
    //         })
    //         .catch(error => {
    //             console.error('Error fetching specialties:', error);
    //         });
    // }, []);

    // Gọi API để lấy danh sách bác sĩ khi chuyên khoa được chọn
    // useEffect(() => {
    //     if (selectedSpecialty) {
    //         axios.get(`/api/doctors?specialty=${selectedSpecialty}`)
    //             .then(response => {
    //                 setDoctors(response.data); 
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching doctors:', error);
    //             });
    //     } else {
    //         setDoctors([]); 
    //     }
    // }, [selectedSpecialty]); 

    const handleSpecialtyChange = (e) => setSelectedSpecialty(e.target.value);
    const handleDoctorChange = (e) => setSelectedDoctor(e.target.value);

    const amTimeSlot = doctorTimeSlot.filter((item) => item.includes('AM'));
    const pmTimeSlot = doctorTimeSlot.filter((item) => item.includes('PM'));

    const last5Days = Array.from({ length: 5 }, (_, index) =>
        moment().clone().subtract(index, 'days')
    )

    return (
        <div style={{ marginTop: '5rem' }}>

            <dir className="p-3" style={{ background: '#f8f9fa' }}>
                <div className="row">
                    <div className="col-md-3 col-sm-12 mt-3 info-part border-end">
                        <p className='py-2 border-bottom info-head-date'>Would you like to schedule an Intervewi? Pick a Date & Time</p>
                        <div className='icon-box'>
                            <div className='d-flex gap-3'>
                                <FaBriefcase className='icon' />
                                <p>With Doctor</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaRegClock className='icon' />
                                <p>30 Min</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaLocationArrow className='icon' />
                                <p>Sylhet, Bangladesh<br /><span className="form-text">1020BD, Amertam, NorthEast,Srimongol</span></p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaLink className='icon' />
                                <p>Zoom Meeting</p>
                            </div>
                            <div className='d-flex gap-3'>
                                <FaCalendarAlt className='icon' />
                                <p>{(selectedDate && selectTime) && moment(selectedDate).format('LL') + ' ' + selectTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5 col-sm-12 mt-3 border-end">
                        <p className='py-2 border-bottom info-head-date'>
                           Chọn thông tin bác sĩ
                        </p>
                        <div className='info-date-card row'>
                            <div className="col-12 mb-3 specialty-box">
                                <label htmlFor="specialty" className="form-label">Chọn chuyên khoa</label>
                                <select id="specialty" className="form-select" onChange={handleSpecialtyChange}>
                                    <option value="">Chọn chuyên khoa</option>
                                    {specialties.map(specialty => (
                                        <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 doctor-box">
                                <label htmlFor="doctor" className="form-label">Chọn bác sĩ</label>
                                <select id="doctor" className="form-select" disabled={!selectedSpecialty} onChange={handleDoctorChange}>
                                    <option value="">Chọn bác sĩ</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 mt-3">
                        <p className='py-2 border-bottom info-head-date'>
                            Chọn thời gian
                        </p>

                        <div className='calendar-container'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                inline // Hiển thị lịch trực tiếp
                                minDate={new Date()} // Chỉ cho phép chọn ngày từ hiện tại trở đi
                                className="inline-calendar float_none"
                            />
                        </div>
                        <div className='select-time-div mb-4'>
                            <h4>Morning Time <span className='text-secondary'>(8AM - 12PM)</span></h4>
                            <select className="form-control" onChange={(e) => handleSelectTime(e.target.value)}>
                                <option value="">Chọn thời gian</option>
                                {amTimeSlot.map((item, id) => (
                                    <option key={id} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        {/* Combobox cho chiều */}
                        <div className='select-time-div'>
                            <h4>Afternoon Time <span className='text-secondary'>(1PM - 5PM)</span></h4>
                            <select className="form-control" onChange={(e) => handleSelectTime(e.target.value)}>
                                <option value="">Chọn thời gian</option>
                                {pmTimeSlot.map((item, id) => (
                                    <option key={id} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </dir>
        </div>
    )
}

export default SelectApppointment;