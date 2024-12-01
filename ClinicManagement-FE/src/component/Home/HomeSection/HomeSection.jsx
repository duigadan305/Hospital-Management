import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

const HomeSection = () => {
    return (
        <section id="hero" className="d-flex align-items-center">
            <div className="container">
                <div>
                    <h1>Giải pháp sức khỏe <br />toàn diện</h1>
                    
                </div>
                <div className="d-flex justify-content-start gap-2">
                    <Link to={'/doctors'} className="btn-get-started scrollto">Đặt lịch khám</Link>
                    {/* <Link to={'/track-appointment'} className="btn-get-started scrollto">Track Appointment</Link> */}
                </div>
            </div>
        </section>
    )
}
export default HomeSection;