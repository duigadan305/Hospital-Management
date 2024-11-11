import React, { useEffect, useState } from 'react'
import Footer from '../Shared/Footer/Footer'
import { useForm } from 'react-hook-form';
import { FaLocationArrow, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Header from '../Shared/Header/Header';
import './index.css';
import SubHeader from '../Shared/SubHeader';
import { useContactMutation } from '../../redux/api/contactApi';
import { message } from 'antd';
import authApiService from '../../service/authApiService';
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import PatientApiService from '../../service/PatientApiService';

const Contact = () => {
    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const isAdmin = authApiService.isAdmin();
    const isUser = authApiService.isUser();
    const [{isLoading}]= useState(false);
    const {register, handleSubmit, reset } = useForm({});
    const [formData, setFormData] = useState({});
    
    const checkAuthAndSetData = async () => {
        if (isAuthenticated && data?.id) {
            try {
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    patient: patientt.patient
                }));
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    console.log("Login==>",data);
    console.log("comment==>",formData);

    const onSubmit = async () => {
        try {
            const response = await PatientApiService.sendComment(formData);
            if (response.statusCode === 200) {
                message.success("Gửi thành công!");
                reset();
                setFormData({}); // Clear form data after submission
            } else {
                message.error("Vui lòng đăng nhập để gửi tin nhắn!");
            }
        } catch (error) {
            message.error("Vui lòng đăng nhập để gửi tin nhắn!");
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    useEffect(() => {
        checkAuthAndSetData();
    }, [authChecked, data, isAuthenticated]);

    return (
        <>
            <Header />
            <SubHeader title="Contact us" subtitle="Lorem ipsum dolor sit amet consectetur adipisicing." />
            <section id="contact" className="contact mt-5 mb-5">
                <div className="container" style={{ marginTop: 80, marginBottom: 120 }}>
                    <div className="row">

                        <div className="col-lg-4">
                            <div className="info rounded p-3" style={{ background: '#f8f9fa' }}>
                                <div className="d-flex mb-2 gap-2">
                                    <FaLocationArrow className='icon' />
                                    <div>
                                        <h4>Location:</h4>
                                        <p>1212 Dhaka, Kazi Nozrul Avenur, Sylhet, Bangladesh 03214</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-2 gap-2">
                                    <FaEnvelope className='icon' />
                                    <div>
                                        <h4>Email:</h4>
                                        <p>ujjalzaman@gmail.com</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-2 gap-2">
                                    <FaPhoneAlt className='icon' />
                                    <div>
                                        <h4>Call:</h4>
                                        <p>+88 01751 040425</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-lg-8">
                            <div className="mb-5 p-2 rounded" style={{ background: '#f8f9fa' }}>
                                <form className="row form-row" onSubmit={handleSubmit(onSubmit)}>

                                    <div className="col-md-12">
                                        <div className="form-group mb-2 card-label">
                                            <label>Subject</label>
                                            <input {...register('subject')} name='subject' required onChange={(e) => handleOnChange(e)} className="form-control" placeholder="Enter your subject"/>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className='form-label'>Message</label>
                                            <textarea {...register('message')}  name='content' required onChange={(e) => handleOnChange(e)} className="form-control mb-3" cols="30" rows="10" placeholder="enter your message"/>
                                        </div>
                                    </div>

                                    <div className="text-center mt-3 mb-5">
                                        <button disabled={isLoading} type='submit' className="appointment-btn">Send Message</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container">
                        {/* eslint-disable-next-line */}
                        <iframe style={{ border: 0, width: "100%", height: "350px" }} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Contact