import React from 'react';
import './index.css';
import img2 from '../../../images/doc/doc4.jpg'

const Service = () => {
    return (
        <section className="container" style={{marginTop: 200, marginBottom:200}}>
            <div className='mb-5 section-title text-center'>
                <h2>Dịch vụ</h2>
                <p className='m-0'>Dịch vụ của chúng tôi</p>
            </div>
            <div className="container">
                <div className="row align-items-center">
                    {/* <div className="col-lg-4 col-sm-6">
                        <div className="service-img">
                            <img src={img} alt="" className="img-fluid" />
                            <img src={img2} alt="" className="img-fluid mt-4" />
                        </div>
                    </div> */}
                    <div className="col-lg-6 col-sm-6">
                        <div className="service-img mt-4 mt-lg-0">
                            <img src={img2} alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="service-content ps-4 mt-4 mt-lg-0">
                            <h2>Chăm sóc sức khỏe <br />cá nhân</h2>
                            <p className="mt-4 mb-5 text-secondary form-text">Chúng tôi luôn cung cấp các dịch vụ tốt nhất cho bệnh nhân.</p>
                            {/* <Link to={'/service'} className="btn-get-started scrollto">Services</Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Service