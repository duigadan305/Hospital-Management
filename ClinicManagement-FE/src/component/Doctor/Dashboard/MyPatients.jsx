import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';
import moment from 'moment';
import { FaClock, FaEnvelope, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { Empty } from 'antd';
import DoctorApiService from '../../../service/DoctorApiService';

const MyPatients = () => {
    const getInitPatientName = (item) => {
        const fullName = `${item?.firstName ?? ''} ${item?.lastName ?? ''}`;
        return fullName.trim() || "Private Patient";
    }
    const [patientData, setPatientData] = useState({});
    useEffect(() => {
        const fetchAppointment = async () => {
          try {
           
            const data = await DoctorApiService.getAllTreatedPatient();
            setPatientData(data.patientList);
          } catch (error) {
            console.error("Error fetching patient:", error);
          }
        };
    
        fetchAppointment();
      }, [patientData]);
    let content = null;
    if ( patientData?.length === 0) content = <Empty/>
    if ( patientData?.length > 0) content =
        <>
            {patientData && patientData?.map((item) => (
                <div className="w-100 mb-3 rounded p-3 text-center" style={{ background: '#f8f9fa' }}>
                    <div className="">
                        {/* <Link to={'/'} className="my-3 patient-img">
                            <img src={data?.patient?.img ? data?.patient?.img : img} alt="" />
                        </Link> */}
                        <div className="patients-info mt-4">
                            <h5>{item.user?.name}</h5>
                            <div className="info">
                                <p><FaClock className='icon' /> {moment(item?.dob).format("DD/MM/YYYY")} </p>
                                <p><FaLocationArrow className='icon' /> {item?.address}</p>
                                <p><FaEnvelope className='icon' /> {item?.user?.email}</p>
                                <p><FaPhoneAlt className='icon' /> {item?.user?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    return (
        <DashboardLayout>
            <div className="row">
                <div className="col-md-6 col-lg-4 col-xl-3">
                    {content}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default MyPatients