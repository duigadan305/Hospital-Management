import { Outlet, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../service/auth.service';
import { useEffect } from 'react';
import useAuthCheck from '../../redux/hooks/useAuthCheck';
import authApiService from '../../service/authApiService';

const PrivateOutlet = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = authApiService.isAuthenticated();
    if (!isAuthenticated) {navigate('/login', {replace: true})}
  }, [navigate])

  return <Outlet />
};

export default PrivateOutlet;