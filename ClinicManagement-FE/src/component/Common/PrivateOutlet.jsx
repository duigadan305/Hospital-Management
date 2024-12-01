import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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