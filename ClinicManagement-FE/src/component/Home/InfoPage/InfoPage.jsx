import React from 'react';
import './InfoPage.css';
import {FaSearch, FaClock,FaHouseUser  } from "react-icons/fa";

const InfoPage = () => {
    return (
        <section className="why-us mt-5 mt-md-0">
            <div className="container">

                <div className="row">
                    {/* <div className="col-lg-4 d-flex align-items-stretch">
                        <div className="content">
                            <h3>Tại sao lại chọn chúng tôi?</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit
                                Asperiores dolores sed et. Tenetur quia eos. Autem tempore quibusdam vel necessitatibus optio ad corporis.
                            </p>
                            <div className="text-center">
                                <Link href="/" className="more-btn">Learn More <i className="bx bx-chevron-right"></i></Link>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="col-lg-12 d-flex align-items-stretch"> */}
                        <div className="icon-boxes d-flex flex-column justify-content-center">
                            <div className="row">
                            <div className="col-xl-3 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaSearch className="icon"/>
                                        <h4>Thông tin</h4>
                                        <small className='text-secondary'>Địa chỉ</small>
                                        <p>Hà Nội, Việt Nam</p>
                                    </div>
                                </div>
                                <div className="col-xl-3 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHouseUser className="icon"/>
                                        <h4>Lịch khám</h4>
                                        <small className='text-secondary'>Phục vụ 24/24</small>
                                        <p></p>
                                    </div>
                                </div>
                                <div className="col-xl-3 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaHouseUser className="icon"/>
                                        <h4>Khẩn cấp</h4>
                                        <small className='text-secondary'>+0123456789</small>
                                        <p>Số điện thoại khẩn cấp</p>
                                    </div>
                                </div>
                                <div className="col-xl-3 d-flex align-items-stretch">
                                    <div className="icon-box mt-4 mt-xl-0">
                                        <FaClock className="icon"/>
                                        <h4>Thời gian làm việc</h4>
                                        <small className='text-secondary'></small>
                                        <ul className='list-group list-group-flush'>
                                        <li className=" d-flex justify-content-between text-nowrap" ><p>Thứ 2 - Chủ nhật : </p> <p>0:00 - 24: 00</p></li>
                                        {/* <li className="list-group-item d-flex justify-content-between text-nowrap" ><p>Thus - Fri : </p> <p>9:00 - 17: 00</p></li>
                                        <li className="list-group-item d-flex justify-content-between text-nowrap" ><p>Sat - Sun : </p> <p>10:00 - 17: 00</p></li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/* </div> */}
                </div>

            </div>
        </section>
    )
}

export default InfoPage