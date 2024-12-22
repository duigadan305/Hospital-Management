
import { useEffect, useState } from "react";
import CategoryApiService from "../../../service/CategoryApiService";
import './index.css';
import DoctorApiService from "../../../service/DoctorApiService";
import swal from "sweetalert";

const TreatmentStep2 = (treatmentDetail) => {
    console.log("iddd=>", treatmentDetail.treatmentDetail);
    const [services, setServices] = useState([]);

    const getServices = async () => {
        try {
            const dataa = await CategoryApiService.getAllServices();
            setServices(dataa.serviceList);
            console.log("servicess=>", dataa.serviceList);
        } catch (error) {
            console.error("Error fetching service:", error);
        }
    };
    useEffect(() => {
        getServices();
    }, [treatmentDetail]);

    const [selectedServices, setSelectedServices] = useState(() => {
        const savedServices = sessionStorage.getItem("selectedServices");
        return savedServices ? JSON.parse(savedServices) : [];
    });

    const [searchCode, setSearchCode] = useState(""); // Tìm kiếm theo mã code
    const [searchName, setSearchName] = useState(""); // Tìm kiếm theo tên dịch vụ
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 9; // Số lượng dịch vụ hiển thị trên mỗi trang

  // Hàm xử lý khi người dùng chọn/deselect một dịch vụ
    const handleServiceSelect = (code) => {
        if (selectedServices.includes(code)) {
        // Nếu đã chọn rồi, bỏ chọn
        setSelectedServices(selectedServices.filter((item) => item !== code));
        } else {
        // Nếu chưa chọn, thêm vào
        setSelectedServices([...selectedServices, code]);
        }
    };

  // Hàm lọc danh sách dịch vụ dựa trên mã code và tên dịch vụ
    const filteredServices = services.filter(
        (service) =>
        service.code.toLowerCase().includes(searchCode.toLowerCase()) &&
        service.name.toLowerCase().includes(searchName.toLowerCase())
    );

  // Hàm tính toán dịch vụ cần hiển thị trong trang hiện tại
    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  // Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Hàm lưu danh sách mã code đã chọn

    const handleSave = async (e) => {
        e.preventDefault();
        DoctorApiService.deleteTreatmentService(treatmentDetail.treatmentDetail.appointment.id);
        for(const item of selectedServices){
            console.log("itemm=>", item);
            const servData = {
                service: {code: item},
                appointment: treatmentDetail.treatmentDetail.appointment,
            };
            try {
                // Call the register method from ApiService
                const response = await DoctorApiService.treatAppointmentServiceStep1(servData);
                console.log("serData===>", servData)
                // Check if the response is successful
            }
            catch (error) {
            }
        }
        swal({
            icon: 'success',
            text: `Thành công`,
            timer: 2000
        })
    }
  
  // Tổng số trang
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const [selectedServiceDetails, setSelectedServiceDetails] = useState(() => {
        const savedDetails = sessionStorage.getItem("selectedServiceDetails");
        return savedDetails ? JSON.parse(savedDetails) : [];
    });
    const totalPrice = selectedServiceDetails.reduce((sum, service) => sum + service.cost, 0);

    useEffect(() => {
        sessionStorage.setItem("selectedServices", JSON.stringify(selectedServices));

        // Cập nhật chi tiết dịch vụ đã chọn
        const updatedDetails = services.filter((service) =>
            selectedServices.includes(service.code)
        );
        setSelectedServiceDetails(updatedDetails);
        sessionStorage.setItem("selectedServiceDetails", JSON.stringify(updatedDetails));
    }, [selectedServices]);

    return (
            <div className="w-100 mb-3 rounded p-3 bg-gray-g">
                <h2 className="text-center mb-4">Danh Sách Dịch Vụ</h2>
               {/* Form tìm kiếm */}
                <div className="search-container mb-4">
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo mã dịch vụ"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    />
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên dịch vụ"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>

                {/* Danh sách dịch vụ */}
                <div className="row">
                    {currentServices.length > 0 ? (
                    currentServices.map((service) => (
                        <div className="col-md-4 mb-4" key={service.code}>
                        <div
                            className={`cardd p-3 ${
                            selectedServices.includes(service.code) ? "border-primary selected" : ""
                            }`}
                            onClick={() => handleServiceSelect(service.code)}
                        >
                            <h5>{service.name}</h5>
                            <p>
                            <strong>Mã:</strong> {service.code}
                            </p>
                            <p>
                            <strong>Giá:</strong> {service.cost.toLocaleString()} VND
                            </p>
                            <p>{service.description}</p>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="col-12 text-center">
                        <p>Không có dịch vụ nào phù hợp với tiêu chí tìm kiếm.</p>
                    </div>
                    )}
                </div>
                
                {/* Danh sách dịch vụ đã chọn */}
                <div className="selected-services mb-4">
                    <h4>Dịch vụ đã chọn:</h4>
                    {selectedServiceDetails.length > 0 ? (
                    <ul>
                        {selectedServiceDetails.map((service) => (
                        <li key={service.code}>
                            {service.name} - {service.cost.toLocaleString()} VND
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p>Chưa có dịch vụ nào được chọn.</p>
                    )}
                    <p>
                    <strong>Tổng cộng:</strong> {totalPrice.toLocaleString()} VND
                    </p>
                </div>

                {/* Nút lưu */}
                <div className="text-center mb-4">
                    <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={selectedServices.length === 0}
                    >
                    Lưu danh sách dịch vụ
                    </button>
                </div>

                {/* Phân trang */}
                <div className="d-flex justify-content-center">
                    <ul className="pagination">
                    {currentPage > 1 && (
                        <li className="page-item">
                        <button className="page-link previous" onClick={() => paginate(currentPage - 1)}>
                            &lt;
                        </button>
                        </li>
                    )}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                        key={index + 1}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                        <button
                            className="page-link"
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                        </li>
                    ))}
                    {currentPage < totalPages && (
                        <li className="page-item">
                        <button className="page-link next" onClick={() => paginate(currentPage + 1)}>
                            &gt;
                        </button>
                        </li>
                    )}
                    </ul>
                </div>
                
            </div>
    )
}

export default TreatmentStep2;