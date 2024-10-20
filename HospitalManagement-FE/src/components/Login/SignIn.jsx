import React, { useState, useEffect } from 'react';
import { FaCheck, FaEnvelope, FaKey, FaKeyboard, FaLock, FaTimes } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import swal from 'sweetalert';
import authApiService from '../../service/authApiService';

const SignIn = ({ handleResponse }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [infoError, setInfoError] = useState('');
    const [show, setShow] = useState(true);
    // const { register, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    // const [userLogin, { isError, isLoading, isSuccess, error }] = useUserLoginMutation();
    const [otp, setOtp] = useState('');
    // const [resetPassword, { isError: resetIsError, isSuccess: resetIsSuccess, error: resetError, isLoading: resetIsLoading }] = useResetPasswordMutation();
    const [formData, setFormData] = useState({
        otp: '',
        email: '',
        password: '',
        expiryTime: '',
        checkedOtp: ''
    });
    const [passwordValidation, setPasswordValidation] = useState({
        carLength: false,
        specailChar: false,
        upperLowerCase: false,
        numeric: false
    })
    const from = location.state?.from?.pathname || '/';

    setTimeout(() => {
        setShow(false);
    }, 10000);


    const onHandleForgotPassword = async (e) => {
        // resetPassword({ email: forgotEmail })
        e.preventDefault();
        try {
            const response = await authApiService.forgotPassword(formData);  
            console.log(response)
            setFormData({
                ...formData,
                checkedOtp: response.otp,
                expiryTime: response.expiryTime
            }); 
                // setShowForgotPassword(!showForgotPassword);
            setIsForgotPassword(!isForgotPassword);
            
        } catch (error) {
            swal({
                icon: 'error',
                text: `Failed! Email not exist`,
                timer: 2000
            });
            setLoading(false);
        }
    }
    const handleNewPass = async (e) => {
        e.preventDefault();
        try {
            const response = await authApiService.resetPassword(formData);      
            setShowForgotPassword(!showForgotPassword);
            setIsForgotPassword(!isForgotPassword);
            setFormData({
                ...formData,
                password: ''
            }); 
            swal({
                icon: 'success',
                text: `Đổi mật khẩu thành công!`,
                timer: 2000
            });
            
        } catch (error) {
            swal({
                icon: 'error',
                text: `Failed! OTP is incorrect`,
                timer: 2000
            });
            setLoading(false);
        }
    }

    const hanldeOnChange = (e) => {
        let { name, value } = e.target;
        hanldeValidation(name, value)
        let isPassValid = true;
        console.log(name);
        if (value === 'password') {
            isPassValid = ((value.length > 8)
                && /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value)
                && /^(?=.*[a-z])(?=.*[A-Z])/.test(value)
                && /^(?=.*\d)/.test(value))
        }

        if (isPassValid) {
            setFormData({ ...formData, [name]: value });
        }
    }

    const hanldeValidation = (name, value) => {
        if (name === 'password') {
            setPasswordValidation({
                carLength: (value.length > 8),
                specailChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
                upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
                numeric: /^(?=.*\d)/.test(value),
            })
        }
    }

    const handleShowForgotPassword = () => {
        setFormData({
            email: '',
            password: ''
        });
        setShowForgotPassword(!showForgotPassword);
        setIsForgotPassword(!isForgotPassword);
    }

    const handleForgotPassword = () => {
        setEmail("");
        setPassword("");
        setShowForgotPassword(!showForgotPassword);
        setIsForgotPassword(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authApiService.loginUser(formData);
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
                setEmail("");
                setPassword("")
            }
        } catch (error) {
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
                            <input name='email' value={formData.email} onChange={(e) => hanldeOnChange(e)} placeholder="Enter Your Email" type="email" required />
                        </div>
                       
                        {isForgotPassword ? 
                            <>
                                <div className="input-field">
                                    <span className="fIcon"><FaKeyboard /></span>
                                    <input name='otp' value={formData.otp} onChange={(e) => hanldeOnChange(e)} placeholder="Enter OTP" type="number" required />
                                </div>
                                <div className="input-field">
                                    <span className="fIcon"><FaKey /></span>
                                    <input name='password' value={formData.password} onChange={(e) => hanldeOnChange(e)} placeholder="Enter new password" type="password" required />
                                </div>
                                <div className="password-validatity mx-auto">
                                    <div style={passwordValidation.carLength ? { color: "green" } : { color: "red" }}>
                                        <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                            <span className="ms-2">Password Must Have atlast 8 character.</span></p>
                                    </div>

                                    <div style={passwordValidation.specailChar ? { color: "green" } : { color: "red" }}>
                                        <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                            <span className="ms-2">Password Must Have a special cracter.</span></p>
                                    </div>

                                    <div style={passwordValidation.upperLowerCase ? { color: "green" } : { color: "red" }}>
                                        <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                            <span className="ms-2">Password Must Have uppercase and lower case.</span></p>
                                    </div>

                                    <div style={passwordValidation.numeric ? { color: "green" } : { color: "red" }}>
                                        <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                            <span className="ms-2">Password Must Have Number.</span></p>
                                    </div>
                                </div>
                                <button onClick={handleNewPass}
                                    className="btn btn-primary btn-block mt-2 iBtn"
                                    disabled={
                                        passwordValidation.carLength && passwordValidation.numeric && passwordValidation.upperLowerCase && passwordValidation.specailChar ? "" : true
                                    }
                                >
                                    {loading ? <Spinner animation="border" variant="info" /> : "Submit"}
                                </button>
                            </> : 
                            <button className="iBtn" type="submit" value="sign In" >
                                {loading ? <Spinner animation="border" variant="info" /> : "Send OTP"}
                            </button>

                        } 
                         <div onClick={handleShowForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Stil Remember Password ?</div>
                    </form>
                    :
                    <form className="sign-in-form" onSubmit={handleSubmit}>
                        {/* <Toast show={show} onClose={() => setShow(!show)} className="signInToast">
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
                        </Toast> */}
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <span className="fIcon"><FaEnvelope /></span>
                            <input placeholder="Enter Your Email" type="email" name="email" onChange={(e) => hanldeOnChange(e)} required />
                        </div>
                        {/* {errors.email && <span className="text-danger">This field is required</span>} */}
                        <div className="input-field">
                            <span className="fIcon"><FaLock /></span>
                            <input  type="password" placeholder="Enter Your Password" name="password" onChange={(e) => hanldeOnChange(e)} required/>
                        </div>
                        {/* {errors.password && <span className="text-danger">This field is required</span>} */}
                        {infoError && <p className="text-danger">{infoError}</p>}
                        <div onClick={handleForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Forgot Password ?</div>
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