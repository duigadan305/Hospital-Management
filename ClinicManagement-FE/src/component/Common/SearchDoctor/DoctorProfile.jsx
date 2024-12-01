import React from 'react'
import Footer from '../Footer/Footer';
import './index.css';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import { Tabs } from 'antd';
import Review from './Review';

const DoctorProfile = () => {
    const { id } = useParams();
    // const { data } = useGetDoctorQuery(id);
    // let content = null;
    // if ( data?.id === undefined) content = <Empty />
    // if ( data?.id) content = <SearchContent data={data} />

    const items = [
        
        {
            key: '1',
            label: 'Đánh giá',
            children: <Review doctorId={id}/>,
        }
        
    ];

    
    return (
        <>
            <Header />
            <div className="container" style={{ marginBottom: '4rem', marginTop: '6rem' }}>

                <div className='p-4 rounded' style={{ marginBottom: '7rem', backgroundColor: '#f3f3f3' }}>
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default DoctorProfile;