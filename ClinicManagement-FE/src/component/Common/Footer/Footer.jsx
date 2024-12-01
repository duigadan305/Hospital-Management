import React from 'react';
import './Footer.css';
import logo1 from '../../../images/logo1.png';
import { Link } from 'react-router-dom';
import { FaAngleDoubleRight } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="footer position-relative">
			<div className="footer-top">
				<div className="container-fluid">
					<div className="row">
						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-about">
								<div className="footer-logo">
									<Link to={'/'}>
										<img src={logo1} alt="logo" style={{ maxWidth: '160px' }} />
									</Link>
								</div>
								<div className="footer-about-content">
									<p className='form-text' style={{maxWidth:200}}>Phóng khám chúng tôi luôn cố gắng làm hài lòng các bệnh nhân</p>
								</div>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-menu">
								<h2 className="footer-title">Dành cho bệnh nhân</h2>
								<ul>
									<li><Link to={'/doctors'}><FaAngleDoubleRight className='icon' />  Tìm kiếm bác sĩ</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' />  Đăng nhập</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' />  Đăng ký</Link></li>
									<li><Link to={'/doctors'}><FaAngleDoubleRight className='icon' />  Đặt lịch</Link></li>
									<li><Link to={'/'}><FaAngleDoubleRight className='icon' />  Dashboard</Link></li>
								</ul>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">

							<div className="footer-widget footer-menu">
								<h2 className="footer-title">Dành cho bác sĩ</h2>
								<ul>
									<li><Link to={'/'}><FaAngleDoubleRight className='icon' /> Lịch khám</Link></li>
									<li><Link to={'/login'}><FaAngleDoubleRight className='icon' /> Đăng nhập</Link></li>
									<li><Link to={'/register'}><FaAngleDoubleRight className='icon' /> Đăng ký</Link></li>
									<li><Link to={'/dashboard'}><FaAngleDoubleRight className='icon' /> Dashboard</Link></li>
								</ul>
							</div>
						</div>

						<div className="col-6 col-md-6 col-lg-3">
							<div className="footer-widget footer-contact">
								<h2 className="footer-title mt-3 mt-md-0">Liên hệ chúng tôi</h2>
								<div className="footer-contact-info">
									<div className="footer-address">
										<span><i className="fas fa-map-marker-alt"></i></span>
										<p> Hà Nội, Việt Nam </p>
									</div>
									<p>
										<i className="fas fa-phone-alt"></i>
										+0123456789
									</p>
									<p className="mb-0">
										<i className="fas fa-envelope"></i>
										tclinic@gmail.com
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-bottom">
				<div className="container-fluid">

					<div className="copyright">
						<div className="row">
							<div className="col-md-6 col-lg-6">
								<div className="copyright-text">
									<p className="mb-0"><a href="templateshub.net">
										<div className="copyRight text-center">
											<p>Bản quyền {(new Date()).getFullYear()}</p>
										</div></a></p>
								</div>
							</div>
							<div className="col-md-6 col-lg-6">
								<div className="copyright-menu">
									<ul className="policy-menu d-flex gap-2 justify-content-center">
										<Link to={'/'} className='text-white'>Chính sách điều khoản và điều kiện</Link>
									</ul>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

		</footer>
	);
};

export default Footer;