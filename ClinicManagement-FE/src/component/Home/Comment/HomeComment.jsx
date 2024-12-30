import "./index.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import AdminApiService from "../../../service/AdminApiService";
import CategoryApiService from "../../../service/CategoryApiService";
import CommentContent from "./CommentContent";

const HomeComment = () => {
  return (
    <section
      className="container"
      style={{ marginTop: 200, marginBottom: 200 }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="">
            <div className="mb-4 section-title text-center">
              <h2 className="text-uppercase">Phản hồi khách hàng</h2>
              {/* <p className='m-0'>Lorem ipsum dolor sit amet consectetur adipisicing.</p> */}
            </div>
            <CommentContent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeComment;
