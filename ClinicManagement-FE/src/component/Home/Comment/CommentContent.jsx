import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import CategoryApiService from "../../../service/CategoryApiService";
import img from "../../../images/avatar.jpg";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
// import "swiper/swiper.scss";
const CommentContent = () => {
  const [contactData, setContactData] = useState([]);
  const fetchContact = async () => {
    try {
      const response = await CategoryApiService.getAllReviewContact();
      setContactData(response.commentList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  useEffect(() => {
    fetchContact();
  }, []);
  return (
    <Swiper
      spaceBetween={30} // Khoảng cách giữa các slide
      slidesPerView={3} // Số lượng slide hiển thị cùng lúc
      loop={true} // Chạy lặp lại
      autoplay={{
        delay: 10000, // Thời gian giữa các lần chuyển slide (ms)
        disableOnInteraction: false, // Tự chạy tiếp sau khi tương tác
      }}
      modules={[Autoplay]}
    >
      {contactData.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="slider-item" style={{ textAlign: "center" }}>
            <div className="slider-image">
              <img src={img} alt={item.subject || "Image"} />
              <br />
              <span>{item.patient?.user?.name}</span>
            </div>
            <div className="slider-title">{item.subject}</div>
            <div className="slider-title">{item.content}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CommentContent;
