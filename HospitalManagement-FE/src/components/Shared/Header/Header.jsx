import { useEffect, useState } from 'react';
import './index.css';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import TopHeader from '../TopHeader/TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import img from '../../../images/logo.png';
import avatar from '../../../images/avatar.jpg';
import { Button, message } from 'antd';
import { loggedOut } from '../../../service/auth.service';
import HeaderNav from './HeaderNav';
import authApiService from '../../../service/authApiService';

const Header = () => {
    const navigate = useNavigate();
    const { authChecked, data } = useAuthCheck();
    const [isLoggedIn, setIsLogged] = useState(false);
    const [show, setShow] = useState(true);
    const [open, setOpen] = useState(false);
    const isAuthenticated = authApiService.isAuthenticated();
    const isAdmin = authApiService.isAdmin();
    const isUser = authApiService.isUser();
    console.log("hehe", data);
    // const lastScrollRef = useRef(0);
    const handleScroll = () => {
        const currentScroll = window.scrollY;
        // if (currentScroll > lastScrollRef.current) { // Undo scroll up effect
        if (currentScroll > 50) {
            setShow(false);
        } else {
            setShow(true);
        }
        // lastScrollRef.current = currentScroll;
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return (() => window.removeEventListener('scroll', handleScroll));
    }, [])

    useEffect(() => { isAuthenticated && setIsLogged(true) }, [isAuthenticated]);


    const hanldeSignOut = () => {
        authApiService.logout();
        message.success("Successfully Logged Out")
        setIsLogged(false)
        navigate('/')
    }


    const content = (
        <div className='nav-popover'>
            <div className='my-2'>
                <h5 className='text-capitalize'>{data.name}</h5>
                <p className='my-0'>{data?.email}</p>
                <Link to="/dashboard">Dashboard</Link>
            </div>
            <Button variant="outline-danger" className='w-100' size="sm" onClick={hanldeSignOut}>
                Logged Out
            </Button>
        </div >
    );
    return (
        <>
            <div className={`navbar navbar-expand-lg navbar-light ${!show && "hideTopHeader"}`} expand="lg">
                <TopHeader />
            </div>
            <header id="header" className={`fixed-top ${!show && "stickyHeader"}`}>
                <div className="container d-flex align-items-center">

                    <Link to={'/'} className="logo me-auto">
                        <img src={img} alt="" className="img-fluid" />
                    </Link>
                    <HeaderNav isLoggedIn={isAuthenticated} data={data}
                        avatar={avatar} content={content} open={open} setOpen={setOpen} />
                    <Link to={isAuthenticated?'/appointment':'/login'} className="appointment-btn scrollto"><span className="d-none d-md-inline">Make an</span> Appointment</Link>
                </div>
            </header>
        </>
    )
}

export default Header