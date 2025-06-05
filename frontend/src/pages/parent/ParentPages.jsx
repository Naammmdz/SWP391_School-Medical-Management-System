import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ParentPages.css";
import HomePageService from "../../services/HomePageService";
import Blog from "../home/Blog/Blog";
// import "../home/homePage/HomePage.css";
import heroImage from "../../assets/images/fpt.jpg";
import './ParentPages.css';

export default function ParentPages() {
  // State for health resources
  const [healthResources, setHealthResources] = useState([]);
  // State for blog posts
  const [blogPosts, setBlogPosts] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for school info
  const [schoolInfo, setSchoolInfo] = useState({});

  useEffect(() => {
    // Fetch health resources from API
     

    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const data = await HomePageService.getBlogPosts();
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        // Fallback to mock data if API fails
        const mockData = [
          {
            id: 1,
            title: "5 cách giúp học sinh giảm căng thẳng trong mùa thi",
            excerpt: "Mùa thi là khoảng thời gian đầy áp lực đối với học sinh. Trong bài viết này...",
            author: "ThS. Nguyễn Thị Hoa",
            thumbnail: "https://th.bing.com/th/id/OIP.fnH5EO0esItVod7gcr26vAHaFZ?w=238&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7",
            publishedAt: "2023-06-01",
          },
          {
            id: 2,
            title: "Tầm quan trọng của bữa sáng đối với học sinh",
            excerpt: "Nhiều nghiên cứu đã chỉ ra rằng bữa sáng là bữa ăn quan trọng nhất trong ngày...",
            author: "BS. Trần Văn Khỏe",
            thumbnail: "https://th.bing.com/th/id/OIP.mlzELnpvexT7SMT8-mMtQgHaE7?w=283&h=188&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7",
            publishedAt: "2023-05-20",
          },
          {
            id: 3,
            title: "Cách phát hiện sớm các vấn đề về thị lực ở trẻ",
            excerpt: "Thị lực kém có thể ảnh hưởng nghiêm trọng đến khả năng học tập của trẻ...",
            author: "BS. Lê Thị Nhãn",
            thumbnail: "https://th.bing.com/th/id/OIP.d7mUbY74nBjN1cwzc9bS7AHaEe?w=301&h=182&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7",
            publishedAt: "2023-05-10",
          },
        ];
        setBlogPosts(mockData);
      }
    };


    // Fetch school info from API
    const fetchSchoolInfo = async () => {
      try {
        const data = await HomePageService.getSchoolInfo();
        setSchoolInfo(data);
      } catch (error) {
        console.error("Error fetching school info:", error);
        // Fallback to mock data if API fails
        setSchoolInfo({
          name: "Trường Tiểu Học FPT",
          slogan: "Chăm sóc sức khỏe toàn diện cho học sinh",
          stats: {
            students: "2000+",
            teachers: "150+",
            medicalStaff: "10+"
          }
        });
      }
    };

    // Execute all fetch functions
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        
        fetchBlogPosts(),
        fetchSchoolInfo()
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <div className="parent-page">
      {/* Hero Section */}
      <section
  className="hero"
  style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`,
        backgroundSize: "100% auto",        // ảnh co lại vừa chiều ngang

        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 30%",
        backgroundColor: "#666",
        color: "white",
        textAlign: "center",
        padding: "120px 0",
        position: "relative",
      }}
>
  <div className="hero-content" style={{ position: "relative", zIndex: 1 }}>
    <h1>{schoolInfo.name || "Trường Tiểu Học"}</h1>
    <p>{schoolInfo.slogan || "Chăm sóc sức khỏe toàn diện cho học sinh"}</p>
    </div>
    </section>

      {/* Health Resources Section */}
      <section className="section health-resources">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ y tế học đường</h2>
            <p>Các dịch vụ chăm sóc và quản lý sức khỏe cho học sinh</p>
          </div>

          {/* {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : ( */}
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://th.bing.com/th/id/OIP.T8VI3zJZx6eqt7CiO-MkTwHaHa?w=184&h=184&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Hồ Sơ Sức Khỏe" />
                  <span className="resource-type guide">Học sinh</span>
                </div>
                <div className="resource-info">
                  <h3>Hồ Sơ Sức Khỏe</h3>
                  <p className="resource-date">Xem thông tin sức khỏe cá nhân học sinh</p>
                  <Link to="/hososuckhoe" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://th.bing.com/th/id/OIP.RjMuv-9xDgxLn7zIXVOGAwHaJ5?cb=iwc2&pid=ImgDet&w=202&h=270&c=7&dpr=2" alt="Sự Kiện Y Tế" />
                  <span className="resource-type guide">Học sinh</span>
                </div>
                <div className="resource-info">
                  <h3>Sự Kiện Y Tế</h3>
                  <p className="resource-date">Xem và xác nhận các sự kiện y tế</p>
                  <Link to="/sukienyte" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://th.bing.com/th/id/OIP.Ze3TuiOXtRqnq7qRQQKOzwHaEU?w=281&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Tiêm Chủng" />
                  <span className="resource-type document">Thông báo</span>
                </div>
                <div className="resource-info">
                  <h3>Tiêm Chủng</h3>
                  <p className="resource-date">Xem và phản hồi thông báo tiêm chủng</p>
                  <Link to="/thongbaotiemchung" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://th.bing.com/th/id/OIP.CPaKDsGbpbajJClRwMaLtwHaEm?w=263&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Kiểm Tra Định Kỳ" />
                  <span className="resource-type document">Thông báo</span>
                </div>
                <div className="resource-info">
                  <h3>Kiểm Tra Định Kỳ</h3>
                  <p className="resource-date">Xem và xác nhận lịch kiểm tra sức khỏe</p>
                  <Link to="/kiemtradinhky" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          {/* )} */}
        </div>
      </section>
      
      {/* Blog Section */}
      <Blog blogPosts={blogPosts} isLoading={isLoading} />

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Liên hệ với chúng tôi</h2>
              <p>
                Nếu bạn có câu hỏi hoặc cần tư vấn về sức khỏe học đường, vui
                lòng liên hệ với chúng tôi.
              </p>
              <ul className="contact-details">
                <li>
                  <i className="icon-location"></i> {schoolInfo.address || "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"}
                </li>
                <li>
                  <i className="icon-phone"></i> {schoolInfo.phone || "(028) 1234 5678"}
                </li>
                <li>
                  <i className="icon-email"></i> {schoolInfo.email || "info@truongthptabc.edu.vn"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 