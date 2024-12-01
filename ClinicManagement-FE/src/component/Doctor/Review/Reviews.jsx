import React, { useEffect, useState } from 'react';
import './Reviews.css';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';
import { FaRegThumbsUp } from "react-icons/fa";
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import { Empty } from 'antd';
import { useParams } from 'react-router-dom';
import CategoryApiService from '../../../service/CategoryApiService';

const Reviews = () => {
    const id = useParams();
    console.log("iddocc=>", id);
    const [reviewData, setReviewData] = useState([]);
    const checkAuthAndSetData = async () => {
        const datadoc = {
            id: id
        }
        const reviews = await CategoryApiService.getAllReviewDoctor(id);
        setReviewData(reviews?.commentList);
    };
    useEffect(() => {
        checkAuthAndSetData();
    }, [id]);
    let content = null;
    if ( reviewData?.length === 0) content = <Empty />
    if ( reviewData?.length > 0) content =
        <>
            {
                reviewData && reviewData.map((item, key) => (
                    <div className='mb-4' key={item?.id + key}>
                        <div className='d-flex gap-3 justify-content-between'>
                            <div className='d-flex gap-4'>
                                
                                <div>
                                    <h5 className="text-nowrap text-capitalize">{item?.patient?.user?.name}</h5>
                                    <p className="text-success"><FaRegThumbsUp /> {item?.subject}</p>
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
                                <div className="">Reviewed {moment(item?.send_date).startOf('day').fromNow()}</div>
                            </div>
                        </div>
                        <div>
                            <p className="mx-2 form-text">{item?.content}</p>
                        </div>
                    </div>
                ))
            }
        </>
    return (
        <DashboardLayout>
            <div className="w-100 mb-3 rounded py-3 px-2" style={{ background: '#f8f9fa' }}>
                {content}
            </div>
        </DashboardLayout>
    )
}

export default Reviews;