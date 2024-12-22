import React, { useState, useEffect } from 'react';
import { FaCheck, FaEnvelope, FaKey, FaKeyboard, FaLock, FaTimes } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import swal from 'sweetalert';
import authApiService from '../../service/authApiService';

const SignIn = ({state }) => {

    const handleResponse = useState();
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
    // const state = from || '/';
    const from = state?.from;
    console.log("from==>",from);
    // console.log("from2==>",from2);
    // const from3 = from || '/admin/dashboard';
    // console.log("from3==>",from3);

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
                if(response.role === "USER"){
                    from ? (navigate(from , { replace: true })) : (navigate('/' , { replace: true }));
                } else if (response.role === "DOCTOR"){
                    from ? (navigate(from , { replace: true })) : (navigate('/dashboard' , { replace: true }));
                }else if (response.role === "STAFF"){
                    from ? (navigate(from , { replace: true })) : (navigate('/dashboard' , { replace: true }));
                }
                 else {
                    from ? (navigate(from , { replace: true })) : (navigate('/admin/dashboard' , { replace: true }));
                }
                setEmail("");
                setPassword("")
            }
        } catch (error) {
            swal({
                icon: 'error',
                text: `Email hoặc mật khẩu không đúng!`,
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
                        <h2 className="title">Quên mật khẩu?</h2>
                        <div>Nhập email đã đăng ký</div>
                        <div className="input-field">
                            <span className="fIcon"><FaEnvelope /></span>
                            <input name='email' value={formData.email} onChange={(e) => hanldeOnChange(e)} placeholder="Nhập email" type="email" required />
                        </div>
                       
                        {isForgotPassword ? 
                            <>
                                <div className="input-field">
                                    <span className="fIcon"><FaKeyboard /></span>
                                    <input name='otp' value={formData.otp} onChange={(e) => hanldeOnChange(e)} placeholder="Nhập OTP" type="number" required />
                                </div>
                                <div className="input-field">
                                    <span className="fIcon"><FaKey /></span>
                                    <input name='password' value={formData.password} onChange={(e) => hanldeOnChange(e)} placeholder="Nhập mật khẩu mới" type="password" required />
                                </div>
                                {
                                    formData.password && 
                                    <div className="password-validatity mx-auto">
                                        <div style={passwordValidation.carLength ? { color: "green" } : { color: "red" }}>
                                            <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                                <span className="ms-2">Mật khẩu phải có ít nhất 8 ký tự</span></p>
                                        </div>

                                        <div style={passwordValidation.specailChar ? { color: "green" } : { color: "red" }}>
                                            <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                                <span className="ms-2">Mật khẩu phải có ký tự đặc biệt</span></p>
                                        </div>

                                        <div style={passwordValidation.upperLowerCase ? { color: "green" } : { color: "red" }}>
                                            <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                                <span className="ms-2">Mật khẩu phải có chữ hoa và chữ thường</span></p>
                                        </div>

                                        <div style={passwordValidation.numeric ? { color: "green" } : { color: "red" }}>
                                            <p>{passwordValidation.numeric ? <FaCheck /> : <FaTimes />}
                                                <span className="ms-2">Mật khẩu phải có ký tự số</span></p>
                                        </div>
                                    </div>
                                }
                                <button onClick={handleNewPass}
                                    className="btn btn-primary btn-block mt-2 iBtn"
                                    disabled={
                                        passwordValidation.carLength && passwordValidation.numeric && passwordValidation.upperLowerCase && passwordValidation.specailChar ? "" : true
                                    }
                                >
                                    {loading ? <Spinner animation="border" variant="info" /> : "Lưu"}
                                </button>
                            </> : 
                            <button className="iBtn" type="submit" value="sign In" >
                                {loading ? <Spinner animation="border" variant="info" /> : "Gửi OTP"}
                            </button>

                        } 
                         <div onClick={handleShowForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Vẫn nhớ mật khẩu?</div>
                    </form>
                    :
                    <form className="sign-in-form" onSubmit={handleSubmit}>
    
                        <h2 className="title">Đăng nhập</h2>
                        <div className="input-field">
                            <span className="fIcon"><FaEnvelope /></span>
                            <input placeholder="Nhập email" type="email" name="email" onChange={(e) => hanldeOnChange(e)} required />
                        </div>
                        {/* {errors.email && <span className="text-danger">This field is required</span>} */}
                        <div className="input-field">
                            <span className="fIcon"><FaLock /></span>
                            <input  type="password" placeholder="Nhập mật khẩu" name="password" onChange={(e) => hanldeOnChange(e)} required/>
                        </div>
                        {/* {errors.password && <span className="text-danger">This field is required</span>} */}
                        {infoError && <p className="text-danger">{infoError}</p>}
                        <div onClick={handleForgotPassword} className='text-bold' style={{ cursor: "pointer", color: '#4C25F5' }}>Quên mật khẩu?</div>
                        <button className="iBtn" type="submit" value="sign In" >
                            {loading ? <Spinner animation="border" variant="info" /> : "Đăng nhập"}
                        </button>
                        <p className="social-text">Đăng nhập bằng Google</p>
                        <SocialSignUp  handleResponse={handleResponse} />
                    </form>
            }
        </>
    );
};

export default SignIn;