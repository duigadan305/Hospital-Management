import React, { useEffect, useState } from 'react'
import {useLocation, useParams } from "react-router-dom";
import img from '../../../images/doc/doctor 3.jpg'
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import { Button, Radio, message, Space, Rate } from 'antd';
import { useForm } from 'react-hook-form';
import CategoryApiService from '../../../service/CategoryApiService';
import PatientApiService from '../../../service/PatientApiService';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import './index.css';
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const Review = () => {
    const doctorId = useParams();
    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const { register, handleSubmit, reset} = useForm({});
    const [value, setValue] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [showError, setShowError] = useState(false);
    const [{isLoading, isError}]= useState(false);
    const [formData, setFormData] = useState({type:'Review'});
    const [reviewData, setReviewData] = useState([]);
    const drequest = {id: doctorId};
    const [showAll, setShowAll] = useState(false);
    const location = useLocation();
    const datadoc = location.state?.datadoc;
    console.log("drequest==>", drequest);
    const checkAuthAndSetData = async () => {
        const reviews = await CategoryApiService.getAllReviewDoctor(datadoc);
        setReviewData(reviews?.commentList);
        if (isAuthenticated && data?.id) {
            try {
                const  doctorData = await CategoryApiService.getDoctorById(drequest);
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    patient: patientt.patient,
                    doctor: doctorData.doctor
                }));
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    
    console.log("doctorId===>", doctorId);

    const onChange = (e) => setRecommend(e.target.value);

    useEffect(() => {
        if (recommend !== null && value !== null) {
            setShowError(true)
        }
    }, [recommend, value]);

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

    const handleOnChangeStar = (value) => {
        // Kiểm tra nếu name là 'star', nghĩa là từ Rate component
        setFormData((prevFormData) => ({ ...prevFormData, star: value }));
    };
    
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setShowError(true);
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    console.log("formmm=>", formData);

    useEffect(() => {
        checkAuthAndSetData();
    }, [authChecked, data, isAuthenticated]);

    let content = null;
    if (!isLoading && !isError && reviewData?.length === 0) content = <div>Empty</div>
    if (!isLoading && !isError && reviewData?.length > 0) {
        const displayedReviews = showAll ? reviewData : reviewData.slice(0, 5);
    
        content = (
            <>
                {displayedReviews.map((item, key) => (
                    <div className='mb-4' key={item?.id + key}>
                        <div className='d-flex gap-3 justify-content-between'>
                            <div className='d-flex gap-4'>
                                {/* <div className='review-img'>
                                    <img className="" alt="" src={img} />
                                </div> */}
                                <div>
                                    <h5 className="text-nowrap">{item?.patient?.name}</h5>
                                    <p className={item?.subject === "Đề xuất bác sĩ" ? "text-success" : ""}>
                                        {item?.subject === "Đề xuất bác sĩ" ? <FaRegThumbsUp /> : <FaRegThumbsDown />} 
                                        {" "}{item?.subject}
                                    </p>
                                </div>
                            </div>
                            <div className='text-end'>
                                <div>
                                    <StarRatings
                                        rating={5}
                                        starRatedColor="#f4c150"
                                        numberOfStars={item.star}
                                        name='rating'
                                        starDimension="15px"
                                        starSpacing="2px"
                                    />
                                </div>
                                <div className="">Reviewed {moment(item?.sendDate).startOf('day').fromNow()}</div>
                            </div>
                        </div>
                        <div>
                            <p className="mx-2 form-text">{item?.content}</p>
                        </div>
                    </div>
                ))}
                {reviewData.length > 5 && (
                    <div className="text-center">
                        <button className="more-btn" onClick={() => setShowAll(!showAll)}>
                            {showAll ? "Show less" : "Show all feedback"}
                        </button>
                    </div>
                )}
            </>
        );
    }
    return (
        <>
            <div>
                <div className="w-100 mb-3 rounded py-3 px-2" style={{ background: '#f8f9fa' }}>
                    {content}
                </div>
    
                <div className="mt-5">
                    <h4>Write a review..</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <div className='d-flex flex-column'>
                                {/* <label className='form-label'>Your Review {value ? <strong>{desc[value - 1]}</strong> : ''}</label> */}
                                <Space>
                                    <Rate name='star' tooltips={desc} onChange={handleOnChangeStar} value={formData.star} />
                                </Space>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <Radio.Group name='subject' onChange={handleOnChange} value={formData.subject}>
                                <Space direction="vertical">
                                    <Radio value={"Đề xuất bác sĩ"}>Đề xuất bác sĩ</Radio>
                                    <Radio value={"Không đề xuất bác sĩ"}>Không đề xuất bác sĩ</Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                        <div className="form-group">
                            {/* <label className='form-label'>Your review</label> */}
                            <textarea onInput={(e) => handleOnChange(e)} name='content' className="form-control" {...register("content")} placeholder="Description..." rows={8} />
                        </div>
                        <hr />
                        <div className="submit-section">
                            <Button htmlType='submit' size='medium' type='primary' disabled={!showError}>Gửi</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
    
}

export default Review