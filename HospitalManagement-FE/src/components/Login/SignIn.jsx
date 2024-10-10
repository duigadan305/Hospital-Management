import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import { useForm } from "react-hook-form";
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { useResetPasswordMutation, useUserLoginMutation } from '../../redux/api/authApi';
import { message } from 'antd';
import swal from 'sweetalert';
import { useMessageEffect } from '../../utils/messageSideEffect';
import authApiService from '../../service/authApiService';

const SignIn = ({ handleResponse }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [infoError, setInfoError] = useState('');
    const [show, setShow] = useState(true);
    // const { register, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    // const [userLogin, { isError, isLoading, isSuccess, error }] = useUserLoginMutation();
    const [forgotEmail, setForgotEmail] = useState('');
    // const [resetPassword, { isError: resetIsError, isSuccess: resetIsSuccess, error: resetError, isLoading: resetIsLoading }] = useResetPasswordMutation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const from = location.state?.from?.pathname || '/';

    setTimeout(() => {
        setShow(false);
    }, 10000);


    const onHandleForgotPassword = async (e) => {
        e.preventDefault();
        // resetPassword({ email: forgotEmail })
        authApiService.forgotPassword(forgotEmail);
        setForgotEmail("");
        setShowForgotPassword(false);
    }
    // useMessageEffect(resetIsLoading, resetIsSuccess, resetIsError, resetError, "Successfully Reset Password, Please check your Email!!")
    // useEffect(() => {
    //     if (isError) {
    //         message.error(error?.data?.message)
    //         setInfoError(error?.data?.message)
    //     }
    //     if (isSuccess) {
    //         message.success('Successfully Logged in');
    //         navigate('/')
    //     }
    // }, [isError, error, isSuccess, navigate])

    const handleShowForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
    }

    const hanldeOnChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authApiService.loginUser({email, password});
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
            }
        } catch (error) {
            setFormData({
                email: '',
                password: '',
            });
            swal({
                icon: 'error',
                text: `Failed! Email or password is incorrect`,
                timer: 2000
            });
            setLoading(false);
        }
    };

    return (
        <>
            {
                showForgotPassword
                    ?
                    <form className="sign-in-form" onSubmit={onHandleForgotPassword}>
                        <h2 className="title">Forgot Password</h2>
                        <div>To Forgot Your Password Please Enter your email</div>
                        <div className="input-field">
                            <span className="fIcon"><FaEnvelope /></span>
                            <input value={forgotEmail !== undefined && forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Enter Your Email" type="email" required />
                        </div>
                        <div onClick={handleShowForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Stil Remember Password ?</div>
                        <button className="iBtn" type="submit" value="sign In" >
                            {loading ? <Spinner animation="border" variant="info" /> : "Submit"}
                        </button>
                    </form>
                    :
                    <form className="sign-in-form" onSubmit={handleSubmit}>
                        <Toast show={show} onClose={() => setShow(!show)} className="signInToast">
                            <Toast.Header>
                                <strong className="mr-auto">Demo credential</strong>
                            </Toast.Header>
                            <Toast.Body>Use this account to sign in as a doctor <br />
                                <hr />
                                <div className='bg-dark text-white p-2 px-3 rounded'>
                                    email : doctor@gmail.com <br />
                                    password : 123456 <br />
                                </div>
                                <hr />
                                <div className='bg-primary p-2 rounded text-white'>
                                    Please do not abuse the facility
                                </div>
                            </Toast.Body>
                        </Toast>
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <span className="fIcon"><FaEnvelope /></span>
                            <input placeholder="Enter Your Email" type="email" name="name" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        {/* {errors.email && <span className="text-danger">This field is required</span>} */}
                        <div className="input-field">
                            <span className="fIcon"><FaLock /></span>
                            <input type="password" placeholder="Enter Your Password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        {/* {errors.password && <span className="text-danger">This field is required</span>} */}
                        {infoError && <p className="text-danger">{infoError}</p>}
                        <div onClick={handleShowForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Forgot Password ?</div>
                        <button className="iBtn" type="submit" value="sign In" >
                            {loading ? <Spinner animation="border" variant="info" /> : "Sign In"}
                        </button>
                        <p className="social-text">Or Sign in with social platforms</p>
                        <SocialSignUp handleResponse={handleResponse} />
                    </form>
            }
        </>
    );
};

export default SignIn;