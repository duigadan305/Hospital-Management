import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import { Pagination } from 'antd';
import DoctorApiService from '../../../service/DoctorApiService';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';
import PatientInvoiceContent from './PatientInvoiceContent';

const PatientInvoice = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPatient, setFilteredPatient] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [filterEmail, setFilterEmail] = useState("")
    const [patientData, setPatientData] = useState([]);
    useEffect(() => {
        const fetchAppointment = async () => {
          try {
           
            const data = await DoctorApiService.getAllTreatedPatient();
            setPatientData(data.patientList);
            setTotal(data.total);
          } catch (error) {
            console.error("Error fetching patient:", error);
          }
        };
    
        fetchAppointment();
      }, [ page, size, searchTerm]);
    
    console.log("patiennn=>", patientData);

    const applyFilters = () => {
        let filtered = patientData;

        if (filterName) {
            filtered = filtered.filter(item =>
                item.user.name.toLowerCase().includes(filterName.toLowerCase())
            );
        }
        if (filterEmail) {
            filtered = filtered.filter(item =>
                item.user.email.toLowerCase().includes(filterEmail.toLowerCase())
            );
        }

        return filtered;
    };

    useEffect(() => {
        const filtered = applyFilters();
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        setFilteredPatient(filtered.slice(startIndex, endIndex)); // Cắt dữ liệu
        setTotal(filtered.length);
    }, [page, size, patientData, filterEmail, filterName]);

    const resetFilter = () =>{
        setPage(1);
        setSize(10);
        setSearchTerm("");
    }

    //what to render
    let content = null;
    if ( filteredPatient.length === 0) content = <div><Empty /></div>
    if ( filteredPatient.length > 0) content =
        <>
            {
                filteredPatient && filteredPatient?.map((item, id) => (
                    <PatientInvoiceContent key={id + item.id} data={item} />
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
            <DashboardLayout>

            <h2 className="text-center mb-4" >Danh Sách bệnh nhân</h2>
               {/* Form tìm kiếm */}
                <div className="search-container mb-4" style={{width:'80%', marginLeft:'100px'}}>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Họ và tên..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    />
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Email..."
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    />
                </div>
                <div className="container" style={{ marginBottom: 200, marginTop: 80 }}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-xl-9" style={{marginLeft:'75px'}}>
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
            </DashboardLayout>
        </div>
    )
}

export default PatientInvoice