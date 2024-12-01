import React from 'react';
import Header from '../Common/Header/Header';
import HomeSection from './HomeSection/HomeSection';
import InfoPage from './InfoPage/InfoPage';
import Service from './HomeService/Service';
import Footer from '../Common/Footer/Footer';

const Home = () => {
    return (
        <>
            <Header />
            <HomeSection />
            <InfoPage />
            <Service />
            {/* <ClinicAndSpecialities /> */}
            {/* <OurDoctors/> */}
            <Footer />
        </>
    );
};

export default Home;