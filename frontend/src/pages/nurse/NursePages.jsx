import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NursePages.css";
import HomePageService from "../../services/HomePageService";
import Blog from "../home/Blog/Blog";
import "../home/homePage/HomePage.css";

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
    const fetchHealthResources = async () => {
      try {
        const data = await HomePageService.getHealthResources();
        setHealthResources(data);
      } catch (error) {
        console.error("Error fetching health resources:", error);
        // Fallback to mock data if API fails
        const mockData = [
          {
            id: 1,
            title: "Hướng dẫn phòng ngừa dịch bệnh mùa hè",
            type: "guide",
            thumbnail: "https://placehold.co/600x400",
            createdAt: "2023-05-15",
          },
          {
            id: 2,
            title: "Thông tin về tiêm chủng bắt buộc cho học sinh",
            type: "document",
            thumbnail: "https://placehold.co/600x400",
            createdAt: "2023-04-20",
          },
        ];
        setHealthResources(mockData);
      }
    };

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
            thumbnail: "https://placehold.co/600x400",
            publishedAt: "2023-06-01",
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
        fetchHealthResources(),
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
      <section className="hero">
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

          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <div className="resources-grid">
              {/* Health Records View */}
              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Hồ Sơ Sức Khỏe" />
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
                  <img src="https://placehold.co/600x400" alt="Khai Báo Thuốc" />
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
                  <img src="https://placehold.co/600x400" alt="Sự Kiện Y Tế" />
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
                  <img src="https://placehold.co/600x400" alt="Tiêm Chủng" />
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
                  <img src="https://placehold.co/600x400" alt="Kiểm Tra Định Kỳ" />
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
                  <img src="https://placehold.co/600x400" alt="Quản Lý Thuốc" />
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
          )}
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
