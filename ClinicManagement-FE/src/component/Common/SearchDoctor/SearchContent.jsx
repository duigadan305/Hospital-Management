import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { Tag } from 'antd';
import './index.css';
import { FaLocationArrow, FaRegThumbsUp, FaComment } from "react-icons/fa";
import { truncate } from '../../../service/truncate';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import CategoryApiService from '../../../service/CategoryApiService';

const SearchContent = ({ data }) => {
    const services = data?.services?.split(',');
    const { authChecked, dataUser } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const [reviewData, setReviewData] = useState([]);
    const getAllReviews = async () => {
        try {
            const reviews = await CategoryApiService.getAllReviewDoctor(data);
            const commentList = reviews?.commentList || [];
            
            // Tổng số bình luận
            const totalComments = commentList.length;
            
            // Số lượt thích với subject = "Đề xuất bác sĩ"
            const likedCount = commentList.filter(review => review.subject === "Đề xuất bác sĩ").length;
            
            // Tính phần trăm lượt thích
            const likedPercentage = totalComments > 0 ? Math.round((likedCount / totalComments) * 100) : 0;
    
            // Cập nhật state với dữ liệu cần thiết
            setReviewData({
                commentList: commentList,
                count: totalComments,
                likedPercentage: likedPercentage  // Giới hạn 2 chữ số thập phân
            });
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        getAllReviews();
    }, [authChecked, data, isAuthenticated]);

    return (
        <div className="mb-4 rounded" style={{ background: '#f3f3f3' }}>
            <div className='d-flex p-3 justify-content-between'>
                <div className='d-flex gap-3'>
                    <div className='doc-img-fluid d-flex align-items-center'>
                        { data?.img && <img src={data?.img} className="" alt="User Image" />}
                    </div>
                    <div className="doc-info">
                        <h5 className='mb-0'><Link to={`/doctors/profile/${data?.id}`}>Dr. {data?.user.name}</Link></h5>
                        <p className='m-0 form-text'>{data?.user?.email}</p>
                        <p className="doc-department m-0">Chuyên khoa: {data?.specialty.name}</p>

                        <div className='d-flex align-items-center'>
                            <div>
                                <StarRatings
                                    rating={5}
                                    starRatedColor="#f4c150"
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="15px"
                                    starSpacing="2px"
                                />
                            </div>
                            <div>({reviewData.count})</div>
                        </div>

                        <div className="clinic-details">
                            <p className="form-text text-secondary"><FaLocationArrow /> {data?.address}, {data?.country}</p>
                        </div>
                        {
                            services?.map((item, id) => (
                                <Tag key={id + 51}>{item}</Tag>

                            ))
                        }
                    </div>
                </div>
                <div className="doc-info-right me-3">
                    <div className="clini-infos">
                        <ul style={{ listStyle: 'none', paddingLeft: '0px', width:'190px' }}>
                            <li><FaRegThumbsUp />  {reviewData.likedPercentage}%</li>
                            <li><FaComment /> {reviewData.count} Đánh giá</li>
                            <li><FaLocationArrow />  {truncate(data?.address, 20)}</li>
                        </ul>
                    </div>
                    <div className="clinic-booking" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link to={`/review/${data?.id}`} state={{ datadoc: data }}  className="view-pro-btn">Đánh giá</Link>
                        <Link to={`/booking/${data?.id}`} className="apt-btn">Đặt lịch khám</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SearchContent