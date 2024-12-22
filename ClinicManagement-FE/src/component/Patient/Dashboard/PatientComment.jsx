import React, { useEffect, useState } from 'react';
import { Button, Tabs, Tag, Modal, Input } from 'antd';
import CustomTable from '../../Common/UI/CustomTable';
import { Link, useParams } from 'react-router-dom';
import PatientApiService from '../../../service/PatientApiService';
import useAuthCheck from '../../../service/useAuthCheck';
import authApiService from '../../../service/authApiService';
import DoctorApiService from '../../../service/DoctorApiService';
import swal from 'sweetalert';
import DashboardLayout from '../../Common/Dashboard/DashboardLayout';
import moment from 'moment';
import { FaPen, FaTrash } from 'react-icons/fa';

const PatientComment= () => {
    const id = useParams();
    const { authChecked, data } = useAuthCheck();
    const isAuthenticated = authApiService.isAuthenticated();
    const [appointmentData, setAppointmentData] = useState([]);
    const [patientData, setPatientData] = useState({});
    const [commentData, setCommentData] = useState([]);
    const [contactComments, setContactComments] = useState([]);
    const [reviewComments, setReviewComments] = useState([]);   
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [editingReview, setEditingReview] = useState(null);   

    const checkAuthAndSetData = async () => {
        if (isAuthenticated && data?.id) {
            try {
                const patientt = await PatientApiService.getPatientByEmail(data.email);
                const cdata = await PatientApiService.getAllPatientComment(id.id);
                setCommentData(cdata?.commentList);
                setPatientData(patientt.patient);
                console.log("ttttt=>", patientt.patient);
            } catch (error) {
                console.error("Error fetching patient:", error);
            }
        }
    };
    useEffect(() => {
        checkAuthAndSetData();
    }, [authChecked, data, isAuthenticated]);

    useEffect(() => {
        // Phân loại bình luận
        const contacts = commentData.filter(comment => comment.type === "Contact");
        const reviews = commentData.filter(comment => comment.type === "Review");
    
        // Cập nhật state
        setContactComments(contacts);
        setReviewComments(reviews);
    }, [commentData]); // Chạy lại khi commenttData thay đổi

    const showEditModal = (comment) => {
        setEditingComment(comment); // Lưu comment đang được sửa
        setIsModalVisible(true); // Hiển thị modal
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        console.log("cmmtt=>", editingComment);
        const response = await PatientApiService.updateComment(editingComment);
        if (response.statusCode === 200) {
            swal({
                icon: 'success',
                text: `Cập nhật thành công!`,
                timer: 2000
            })
            const cdata = await PatientApiService.getAllPatientComment(id.id);
            setCommentData(cdata?.commentList);
        }

        setIsModalVisible(false); // Đóng modal sau khi lưu
    };

    const showEditReviewModal = (review) => {
        setEditingReview(review); // Lưu thông tin review đang sửa
        setIsReviewModalVisible(true); // Hiển thị modal
    };
    
    // Đóng modal sửa review
    const handleReviewModalCancel = () => {
        setIsReviewModalVisible(false);
    };
    
    // Lưu thông tin sau khi chỉnh sửa
    const handleReviewSave = async () => {
        console.log("cmmtt=>", editingReview);
        const response = await PatientApiService.updateComment(editingReview);
        if (response.statusCode === 200) {
            swal({
                icon: 'success',
                text: `Cập nhật thành công!`,
                timer: 2000
            })
            const cdata = await PatientApiService.getAllPatientComment(id.id);
            setCommentData(cdata?.commentList);
        }

        setIsReviewModalVisible(false); // Đóng modal sau khi lưu
    };
    
    const showConfirmCancel = (comment) => {
        Modal.confirm({
            title: 'Xác nhận xóa bình luận',
            content: 'Bạn có chắc chắn muốn xóa bình luận này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => deleteComment(comment),
        });
    };

    const deleteComment = async (comment) => {
        console.log("cmmtt=>", comment);
        const response = await PatientApiService.deleteComment(comment.id);
        if (response.statusCode === 200) {
            swal({
                icon: 'success',
                text: `Xóa thành công!`,
                timer: 2000
            })
            const cdata = await PatientApiService.getAllPatientComment(id.id);
            setCommentData(cdata?.commentList);
        }

        setIsReviewModalVisible(false); // Đóng modal sau khi lưu
    };
    
    const reviewColumns = [
        {
            title: 'Bác sĩ',
            // key: 20,
            width: 70,
            render: function (contactComments) {
                return <>
                    <div className="avatar avatar-sm mr-2 d-flex gap-2">                     
                        <div>
                            <h6 className='text-nowrap mb-0'>Bs. {contactComments?.doctor?.user?.name}</h6>
                            <p className='form-text'>{contactComments?.doctor?.specialty?.name}</p>
                        </div>
                    </div>
                </>
            }
        },
        {
            title: 'Đề xuất',
            // key: 20,
            width: 80,
            render: function (contactComments) {
                return (
                    <div style={{ textAlign: 'left' }}>{contactComments?.subject}</div>
                )
            }
        },
        {
            title: 'Số sao',
            // key: 20,
            width: 40,
            render: function (contactComments) {
                return (
                    <div style={{ textAlign: 'center' }}>{contactComments?.star}</div>
                )
            }
        },
        {
            title: 'Nội dung',
            // key: 22,
            width: 150,
            render: function (contactComments) {
                return (
                    <div style={{ textAlign: 'left' }}>{contactComments?.content}</div>
                )
            }
        },
        {
            title: 'Thời gian gửi',
            // key: 23,
            width: 70,
            render: function (contactComments) {
                const formattedDate = contactComments?.sendDate
                ? moment(contactComments.sendDate).format('DD/MM/YYYY HH:mm')
                : '';

                return <div style={{ textAlign: 'left' }}>{formattedDate}</div>;
            }
        },
        {
            title: 'Hành động',
            // key: 25,
            width: 70,
            render: function (contactComments) {
                return (
                    <div style={{ display: 'flex', justifyContent:'space-between' }}>          
                        <Button type='primary'  onClick={() => showEditReviewModal(contactComments)}><FaPen/></Button>                
                        <Button type='' style={{color:'orangered', marginLeft:'5px'}}  onClick={() => showConfirmCancel(contactComments)}><FaTrash/></Button>                  
                    </div>
                    
                )
            }
        },
    ];

    const contactColumns = [
        {
            title: 'Tiêu đề',
            // key: 20,
            width: 100,
            render: function (contactComments) {
                return (
                    <div style={{ textAlign: 'left' }}>{contactComments?.subject}</div>
                )
            }
        },
        {
            title: 'Nội dung',
            // key: 22,
            width: 150,
            render: function (contactComments) {
                return (
                    <div style={{ textAlign: 'left' }}>{contactComments?.content}</div>
                )
            }
        },
        {
            title: 'Thời gian gửi',
            // key: 23,
            width: 70,
            render: function (contactComments) {
                const formattedDate = contactComments?.sendDate
                ? moment(contactComments.sendDate).format('DD/MM/YYYY HH:mm')
                : '';

            return <div style={{ textAlign: 'center' }}>{formattedDate}</div>;
            }
        },
        {
            title: 'Hành động',
            // key: 25,
            width: 70,
            render: function (contactComments) {
                return (
                    <div style={{ display: 'flex', justifyContent:'space-between' }}>          
                        <Button type='primary'  onClick={() => showEditModal(contactComments)}><FaPen/></Button>                
                       <Button type='' style={{color:'orangered', marginLeft:'5px'}}  onClick={() => showConfirmCancel(contactComments)}><FaTrash/></Button>                  
                    </div>
                    
                )
            }
        },
    ];

    const items = [
        {
            key: '1',
            label: 'Lời nhắn liên hệ',
            children: <CustomTable
                columns={contactColumns}
                dataSource={contactComments}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
        {
            key: '2',
            label: 'Đánh giá bác sĩ',
            children: <CustomTable
                columns={reviewColumns}
                dataSource={reviewComments}
                showPagination={true}
                pageSize={10}
                showSizeChanger={true}
            />,
        },
    ];
    return (
        <DashboardLayout>            
            <Tabs defaultActiveKey="1" items={items} />
            <Modal
                title="Chỉnh sửa bình luận"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <div>
                    <span style={{fontWeight:'bold'}}>Tiêu đề:</span>
                    <Input
                        value={editingComment?.subject}
                        onChange={(e) =>
                            setEditingComment({ ...editingComment, subject: e.target.value })
                        }
                    />
                </div>
                <div style={{ marginTop: '15px' }}>
                    <span style={{fontWeight:'bold'}}>Nội dung:</span>
                    <Input.TextArea
                        rows={4}
                        value={editingComment?.content}
                        onChange={(e) =>
                            setEditingComment({ ...editingComment, content: e.target.value })
                        }
                    />
                </div>
            </Modal>
            <Modal
                title="Chỉnh sửa đánh giá"
                visible={isReviewModalVisible}
                onCancel={handleReviewModalCancel}
                onOk={handleReviewSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <div>
                <span style={{fontWeight:'bold'}}>Bác sĩ:</span>
                    <Input
                        value={`Bs. ${editingReview?.doctor?.user?.name}`}
                        disabled // Không cho chỉnh sửa
                    />
                </div>

                <div style={{ marginTop: '15px' }}>
                <span style={{fontWeight:'bold'}}>Đề xuất:</span>
                    <select
                        value={editingReview?.subject}
                        onChange={(e) =>
                            setEditingReview({ ...editingReview, subject: e.target.value })
                        }
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="Đề xuất bác sĩ">Đề xuất bác sĩ</option>
                        <option value="Không đề xuất bác sĩ">Không đề xuất bác sĩ</option>
                    </select>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <span style={{fontWeight:'bold'}}>Đánh giá sao:</span>
                    <Input
                        type="number"
                        min={1}
                        max={5}
                        value={editingReview?.star}
                        onChange={(e) =>
                            setEditingReview({ ...editingReview, star: e.target.value })
                        }
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginTop: '15px' }}>
                    <span style={{fontWeight:'bold'}}>Nội dung:</span>
                    <Input.TextArea
                        rows={4}
                        value={editingReview?.content}
                        onChange={(e) =>
                            setEditingReview({ ...editingReview, content: e.target.value })
                        }
                    />
                </div>
            </Modal>
        </DashboardLayout>
    )
}
export default PatientComment;