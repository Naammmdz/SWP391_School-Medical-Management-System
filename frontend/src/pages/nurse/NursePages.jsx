import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NursePages.css";
import HomePageService from "../../services/HomePageService";
import Blog from "../home/Blog/Blog";
import "../home/homePage/HomePage.css";
import heroImage from "../../assets/images/fpt.jpg"

export default function NursePages() {
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
          name: "Trường Tiểu Học",
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
       // fetchHealthResources(),
        fetchBlogPosts(),
        fetchSchoolInfo()
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  return (
    <div className="nurse-page">
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
        <div className="hero-content">
          <h1>{schoolInfo.name || "Trường Tiểu Học"}</h1>
          <p>{schoolInfo.slogan || "Chăm sóc sức khỏe toàn diện cho học sinh"}</p>
        </div>
      </section>

      {/* Health Resources Section */}
      <section className="section health-resources">
        <div className="container">
          <div className="section-header">
            <h2>Quản lý y tế học đường</h2>
            <p>Các chức năng quản lý và chăm sóc sức khỏe cho học sinh</p>
          </div>
{/* 
          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : ( */}
            <div className="resources-grid">
              {/* Health Records View */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://th.bing.com/th/id/OIP.T8VI3zJZx6eqt7CiO-MkTwHaHa?w=184&h=184&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Hồ Sơ Sức Khỏe" />
                  <span className="resource-type guide">Xem</span>
                </div>
                <div className="resource-info">
                  <h3>Hồ Sơ Sức Khỏe</h3>
                  <p className="resource-date">Xem thông tin sức khỏe học sinh</p>
                  <Link to="/hososuckhoe" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              {/* Medicine Declarations View */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                                    <img src="data:image/jpeg;base64,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" alt="Khai Báo Thuốc" />

                  <span className="resource-type guide">Xem</span>
                </div>
                <div className="resource-info">
                  <h3>Khai Báo Thuốc</h3>
                  <p className="resource-date">Xem khai báo thuốc từ phụ huynh</p>
                  <Link to="/khaibaothuoc" className="btn btn-sm">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              {/* Medical Events Management */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                <img src="https://th.bing.com/th/id/OIP.RjMuv-9xDgxLn7zIXVOGAwHaJ5?cb=iwc2&pid=ImgDet&w=202&h=270&c=7&dpr=2" alt="Sự Kiện Y Tế" />

                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Sự Kiện Y Tế</h3>
                  <p className="resource-date">Quản lý và tạo sự kiện y tế</p>
                  <Link to="/sukienyte" className="btn btn-sm">
                    Quản lý
                  </Link>
                </div>
              </div>

              {/* Vaccination Management */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                <img src="https://th.bing.com/th/id/OIP.Ze3TuiOXtRqnq7qRQQKOzwHaEU?w=281&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Tiêm Chủng" />

                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Quản Lý Tiêm Chủng</h3>
                  <p className="resource-date">Tạo và quản lý lịch tiêm chủng</p>
                  <Link to="/quanlytiemchung" className="btn btn-sm">
                    Quản lý
                  </Link>
                </div>
              </div>

              {/* Health Check Management */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                <img src="https://th.bing.com/th/id/OIP.CPaKDsGbpbajJClRwMaLtwHaEm?w=263&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Kiểm Tra Định Kỳ" />

                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Kiểm Tra Định Kỳ</h3>
                  <p className="resource-date">Tạo và quản lý lịch kiểm tra sức khỏe</p>
                  <Link to="/kiemtradinhky" className="btn btn-sm">
                    Quản lý
                  </Link>
                </div>
              </div>

              {/* Pharmaceutical Management */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                <img src="https://th.bing.com/th/id/OIP.Rnn3kvs71IlHgiAqv4CUQgHaEN?w=311&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Quản Lý Thuốc" />

                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Quản Lý Thuốc</h3>
                  <p className="resource-date">Quản lý kho thuốc và đơn thuốc</p>
                  <Link to="/quanlythuoc" className="btn btn-sm">
                    Quản lý
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
