import React, { useState } from "react";
import { Button } from "antd";
import './index.css';

const ImageDisplayWithZoom = ({ fileName, fileContent, fileType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imageTypes = ["image/jpeg", "image/png", "image/gif"];
    const isImage = imageTypes.includes(fileType);

    const handleImageClick = () => {
        if (isImage) setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {isImage ? (
                <>
                    <img
                        src={`data:${fileType};base64,${fileContent}`}
                        alt={fileName}
                        style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
                        onClick={handleImageClick}
                    />
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={handleCloseModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div style={{textAlign: 'right'}}>
                                <Button style={{width:'20px'}} onClick={handleCloseModal} type="primary">X</Button>
                               
                           </div>
                                <img
                                    src={`data:${fileType};base64,${fileContent}`}
                                    alt={fileName}
                                    style={{ maxWidth: "90%", maxHeight: "90%" }}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <a
                    href={`data:${fileType};base64,${fileContent}`}
                    download={fileName}
                    className="btn btn-link"
                >
                    {fileName}
                </a>
            )}
        </div>
    );
};

export default ImageDisplayWithZoom;
