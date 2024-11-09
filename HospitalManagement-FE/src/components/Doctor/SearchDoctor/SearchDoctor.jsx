import React, { useState, useEffect } from 'react';
import Footer from '../../Shared/Footer/Footer';
import SearchSidebar from './SearchSidebar';
import SearchContent from './SearchContent';
import { Empty } from 'antd';
import { Pagination } from 'antd';
import Header from '../../Shared/Header/Header';
import SubHeader from '../../Shared/SubHeader';
import CategoryApiService from '../../../service/CategoryApiService';

const SearchDoctor = () => {
    const query = {};
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortByGender, setSorByGender] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [doctorsData, setDoctorsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchDoctors = async () => {
        setIsLoading(true);
        setIsError(false);
        
        const doctorRequest = {
            gender: sortByGender || undefined,
            user: { name: searchTerm || undefined },
            specialty: { id: specialist || undefined },
            page,
            limit: size
        };
        console.log("request==>", doctorRequest);
        
        try {
            const data = await CategoryApiService.getAllDoctors(doctorRequest);
            setDoctorsData(data);
        } catch (error) {
            setIsError(true);
            console.error("Error fetching doctors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    console.log("search===>",doctorsData);

    // Gọi API mỗi khi các điều kiện tìm kiếm thay đổi
    useEffect(() => {
        fetchDoctors();
    }, [page, size, searchTerm, sortByGender, specialist]);
    
    const resetFilter = () =>{
        setPage(1);
        setSize(10);
        setSortOrder("");
        setSearchTerm("");
        setSorByGender("");
        setSpecialist("");
    }

    //what to render
    let content = null;
    if (isLoading) content = <>Loading ...</>;
    if (!isLoading && isError) content = <div>Something Went Wrong !</div>
    if (!isLoading && !isError && doctorsData.length === 0) content = <div><Empty /></div>
    if (!isLoading && !isError && doctorsData.length > 0) content =
        <>
            {
                doctorsData && doctorsData?.map((item, id) => (
                    <SearchContent key={id + item.id} data={item} />
                ))
            }
        </>

    const onShowSizeChange = (current, pageSize) => {
        setPage(page);
        setSize(pageSize)
    }

    return (
        <div>
            <Header />
            <SubHeader title='Doctors' subtitle='Lorem ipsum dolor sit amet.' />
            <div className="container" style={{ marginBottom: 200, marginTop: 80 }}>
                <div className="container-fluid">
                    <div className="row">
                        <SearchSidebar
                            setSearchTerm={setSearchTerm}
                            setSorByGender={setSorByGender}
                            setSpecialist={setSpecialist}
                            resetFilter={resetFilter}
                            query={query}
                        />
                        <div className="col-md-12 col-lg-8 col-xl-9">
                            {content}
                            <div className='text-center mt-5 mb-5'>
                                <Pagination
                                    showSizeChanger
                                    onShowSizeChange={onShowSizeChange}
                                    total={""}
                                    pageSize={size}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default SearchDoctor