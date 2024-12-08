import React, { useEffect, useState } from 'react';
import './Reviews.css';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';
import { FaRegThumbsUp, FaStar, FaUsers, FaChartBar, FaFilter } from "react-icons/fa";
import moment from 'moment';
import StarRatings from 'react-star-ratings';
import { Empty } from 'antd';
import _ from "lodash";
import { useParams } from 'react-router-dom';
import CategoryApiService from '../../../service/CategoryApiService';

const Reviews = () => {
    const id = useParams();
    console.log("iddocc=>", id);
    const [reviewData, setReviewData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStar, setSelectedStar] = useState("All");
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

    const averageStars = _.meanBy(reviewData, "star").toFixed(1);

    // Top 3 người bình luận nhiều nhất
    const topCommenters = _.chain(reviewData)
        .groupBy("patient.user.name")
        .map((comments, name) => ({ name, count: comments.length }))
        .orderBy("count", "desc")
        .take(3)
        .value();

    // Thống kê số bình luận theo từng mức sao
    const starCount = _.countBy(reviewData, "star");

    const cardData = [
        {
            icon: <FaStar className="icon text-warning" />,
            title: "Số sao trung bình",
            amount: `${averageStars}/5`,
        },
        {
            icon: <FaUsers className="icon text-primary" />,
            title: "Top người bình luận",
            amount: topCommenters.map((c, i) => (
                <span key={i}>
                    {i + 1}. {c.name} ({c.count})
                    <br />
                </span>
            )),
        },
        {
            icon: <FaChartBar className="icon text-success" />,
            title: "Thống kê số sao",
            amount: (
                <div>
                    <div className="d-flex justify-content-between">
                        {[5, 4, 3].map((star) => (
                            <span key={star}>
                                {star}⭐: {starCount[star] || 0}
                            </span>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between">
                        {[2, 1].map((star) => (
                            <span key={star}>
                                {star}⭐: {starCount[star] || 0}
                            </span>
                        ))}
                        <span style={{width:'50px'}}>
                              
                            </span>
                    </div>
                </div>
            ),
        },
    ];

    // Lọc dữ liệu theo số sao
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSelectedStar(value);
        if (value === "All") {
            setFilteredData(reviewData);
        } else {
            setFilteredData(reviewData.filter((item) => item.star === parseInt(value)));
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Tính toán dữ liệu cần hiển thị cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Xử lý chuyển trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    let content = null;
    if ( reviewData?.length === 0) content = <Empty />
    if ( reviewData?.length > 0) content =
        <>
            {
                currentItems && currentItems.map((item, key) => (
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
            <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <li 
                        key={index} 
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        <span className="page-link" style={{ cursor: 'pointer' }}>
                            {index + 1}
                        </span>
                    </li>
                ))}
            </ul>
        </nav>
        </>
    return (
        <DashboardLayout>
            <div className="row mb-4 p-3 rounded" style={{ background: "#f8f9fa" }}>
                {cardData.map((item, index) => (
                    <div className="col-md-12 col-lg-4 mb-3" key={index}>
                        <div className="d-flex gap-3 align-items-center dash-card p-3 bg-white rounded shadow-sm">
                            <div className="dash-card-icon">
                                {item.icon}
                            </div>
                            <div className="dash-widget-info" style={{width:'60%'}}>
                                <h6 className="mb-1">{item.title}</h6>
                                <p className="my-1">{item.amount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex align-items-center mb-3">
                <FaFilter className="me-2" />
                <select className="form-select" style={{width: '100px'}} value={selectedStar} onChange={handleFilterChange}>
                    <option value="All">Tất cả</option>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <option key={star} value={star}>
                            {star} ⭐
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-100 mb-3 rounded py-3 px-2" style={{ background: '#f8f9fa' }}>
                {content}
            </div>
        </DashboardLayout>
    )
}

export default Reviews;