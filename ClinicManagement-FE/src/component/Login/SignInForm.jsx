import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import log from '../../images/doc/login1.webp';
import register from '../../images/doc/register.png';
import SignIn from './SignIn';
import './SignInForm.css';
import SignUp from './SignUp';
import { useLocation, useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const [isSignUp, setSignUp] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location?.state;
    return (
        <div className={`${isSignUp ? "signin-signup-container sign-up-mode" : "signin-signup-container"}`}>
            <Link to="/">
                <span className="pageCloseBtn"><FaTimes /></span>
            </Link>
            <div className="forms-container">
                <div className="signIn-singUp">
                    <SignIn state = {state}/>
                    <SignUp setSignUp={setSignUp} />
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3 className=''>Chưa có tài khoản?</h3>
                        <p style={{ color: '#000' }}>Đăng ký tại đây</p>
                        <button className="iBtn transparent" onClick={() => setSignUp(true)}>Đăng ký</button>
                    </div>
                    <img src={`${log}`} alt="" className="pImg" />
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3 className=''>Đã có tài khoản?</h3>
                        <p style={{ color: '#000' }}>Đăng nhập tại đây</p>
                        <button className="iBtn transparent" onClick={() => setSignUp(false)}>Đăng nhập</button>
                    </div>
                    <img src={`${register}`} alt="" className="pImg" />
                </div>
            </div>
        </div>
    );
};

export default SignInForm;