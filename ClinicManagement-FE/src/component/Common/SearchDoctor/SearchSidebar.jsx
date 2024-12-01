import React, { useState, useEffect } from 'react';
import { Button, Radio } from 'antd';
import { FaSearch, FaRedoAlt } from "react-icons/fa";
import Search from 'antd/es/input/Search';
import CategoryApiService from '../../../service/CategoryApiService';
// import { doctorSpecialistOptions } from '../../../constant/global';

const SearchSidebar = ({ setSearchTerm, setSorByGender, setSpecialist, resetFilter }) => {
  const [query, setQuery] = useState(); 
  const options = [
    {
      label: 'Nam',
      value: 'Male',
    },
    {
      label: 'Nữ',
      value: 'Female',
    },
    {
      label: 'Khác',
      value: 'Other',
    },
  ];

  const [doctorSpecialistOptions, setDoctorSpecialistOptions] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specialties = await CategoryApiService.getAllSpecialty();
        // Chuyển dữ liệu thành dạng phù hợp cho Radio.Group
        const options = specialties.map(specialty => ({
          label: specialty.name,
          value: specialty.id,
        }));
        setDoctorSpecialistOptions(options);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      }
    };

    fetchSpecialties();
  }, []);

  const onSelectGender = (e) => {
    setSorByGender(e.target.value);
    setQuery(e.target.value)
  }
  const onSelectSepcialist = (e) => {
    setSpecialist(e.target.value);
    setQuery(e.target.value)
  }
  const onSearch = (value) => {
    setSearchTerm(value);
    setQuery(value)
  }
  return (
    <div className="col-md-12 col-lg-4 col-xl-3">

      <div className="p-3 rounded" style={{ background: '#f3f3f3' }}>
        <h5 className='text-center mb-3' style={{ color: '#05335c' }}>Điều kiện lọc</h5>
        <div className="mb-3">
          <Search placeholder="Search..." onSearch={onSearch} enterButton allowClear />
        </div>

        {/* <div className='mb-3'>
          <h6 style={{ color: '#05335c' }}>Date Range</h6>
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={handleDateChange}
          />
        </div> */}

        <div className='mb-3'>
          <h6 style={{ color: '#05335c' }}>Giới tính</h6>
          <div className='d-flex flex-column'>
            <Radio.Group options={options} onChange={onSelectGender} />
          </div>
        </div>

        {/* <div className='mb-3'>
          <h6 style={{ color: '#05335c' }}>Price Range</h6>
          <Slider range defaultValue={[75, 150]} onChange={onRangeChange} />
        </div> */}

        <div className='mb-3'>
          <h6 style={{ color: '#05335c' }}>Chọn chuyên khoa</h6>
          <div className='d-flex flex-column'>
            <Radio.Group options={doctorSpecialistOptions} onChange={onSelectSepcialist} />
          </div>
        </div>

        <Button className='w-100 mt-4 mb-2' type="primary" style={{backgroundColor:'#1977cc'}} shape="round" icon={<FaSearch />} size="sm">Tìm kiếm</Button>
        {
          query && <Button className='w-100 mt-4 mb-2' style={{backgroundColor:'#1977cc'}} onClick={resetFilter} type="primary" shape="round" icon={<FaRedoAlt />} size="sm">Reset</Button>
        }
      </div>

    </div>
  )
}

export default SearchSidebar