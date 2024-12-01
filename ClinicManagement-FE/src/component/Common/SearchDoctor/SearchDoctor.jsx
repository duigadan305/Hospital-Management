import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import SearchSidebar from './SearchSidebar';
import SearchContent from './SearchContent';
import { Empty } from 'antd';
import { Pagination } from 'antd';
import Header from '../Header/Header';
// import SubHeader from '../../Shared/SubHeader';
import CategoryApiService from '../../../service/CategoryApiService';

const SearchDoctor = () => {
    const query = {};
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortOrder, setSortOrder] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortByGender, setSorByGender] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [doctorsData, setDoctorsData] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
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
            setDoctorsData(data.doctorList);
            setTotal(data.total);
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
    
    const applyFilters = () => {
        let filtered = doctorsData;

        if (sortByGender) {
            filtered = filtered.filter(item => item.gender === sortByGender);
        }

        if (specialist) {
            filtered = filtered.filter(item => item.specialty.id === specialist);
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    useEffect(() => {
        const filtered = applyFilters();
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        setFilteredDoctors(filtered.slice(startIndex, endIndex)); // Cắt dữ liệu
        setTotal(filtered.length);
    }, [page, size, doctorsData]);

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
    if (!isLoading && !isError && filteredDoctors.length === 0) content = <div><Empty /></div>
    if (!isLoading && !isError && filteredDoctors.length > 0) content =
        <>
            {
                filteredDoctors && filteredDoctors?.map((item, id) => (
                    <SearchContent key={id + item.id} data={item} />
                ))
            }
        </>

const onPageChange = (page) => {
    setPage(page);
};

// Handle page size change
const onShowSizeChange = (current, pageSize) => {
    setPage(1); // Reset to the first page when page size changes
    setSize(pageSize);
};

    return (
        <div>
            <Header />
            <div style={{ marginBottom: 200, marginTop: 80 }}></div>
            <div className="container" style={{ marginBottom: 200, marginTop: 80 }}>
                <div className="container-fluid">
                    <div className="row">
                        <SearchSidebar
                            setSearchTerm={setSearchTerm}
                            setSorByGender={setSorByGender}
                            setSpecialist={setSpecialist}
                            resetFilter={resetFilter}
                        />
                        <div className="col-md-12 col-lg-8 col-xl-9">
                            {content}
                            <div className='text-center mt-5 mb-5'>
                                <Pagination
                                    current={page}
                                    pageSize={size}
                                    total={total}
                                    showSizeChanger
                                    onChange={onPageChange}
                                    onShowSizeChange={onShowSizeChange}
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