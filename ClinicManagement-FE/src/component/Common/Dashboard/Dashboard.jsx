import React from 'react'
// import DoctorDashCard from './doctor/DoctorDashCard';
import useAuthCheck from '../../../service/useAuthCheck';
import DashboardLayout from './DashboardLayout';
import DoctorDashboard from '../../Doctor/Dashboard/DoctorDashboard';
import PatientDashboard from '../../Patient/Dashboard/PatientDashboard';
import DoctorDashCard from '../../Doctor/Dashboard/DoctorDashCard';
import StaffDashboard from '../../Staff/Dashboard/StaffDashboard';

const Dashboard = () => {
    const { role } = useAuthCheck();
    console.log(role);
    return (
        <>
            <DashboardLayout>
                {role === 'DOCTOR' && <DoctorDashCard />}

                <div className="row">
                    {role === 'USER' &&
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title my-3">Lịch sử khám bệnh</h5>
                            <PatientDashboard />
                        </div>
                    }
                    {role === 'STAFF' &&
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title py-3">Lịch hẹn khám</h5>
                            <StaffDashboard />
                        </div>
                    }
                    {role === 'DOCTOR' &&
                        <div className="col-md-12 rounded" style={{ background: '#f8f9fa' }}>
                            <h5 className="text-title py-3">Lịch hẹn khám</h5>
                            <DoctorDashboard />
                        </div>
                    }

                </div>
            </DashboardLayout>
        </>
    )
}

export default Dashboard;