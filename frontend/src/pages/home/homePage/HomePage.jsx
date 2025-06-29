import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import HomePageService from "../../../services/HomePageService";
import Blog from "../Blog/Blog";
// import DashboardPage from "../../dashboardPage/DashboardPage";
import heroImage from "../../../assets/images/FPTers.png";
import aboutImage from "../../../assets/images/1112.jpg";
import axios from "axios";


export default function HomePage() {
  // State for health resources
  const [healthResources, setHealthResources] = useState([]);
  // State for blog posts
  const [blogPosts, setBlogPosts] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for auth status (temporary)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  // State for school info
  const [schoolInfo, setSchoolInfo] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
  

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

    // Check authentication status
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }
      try {
        // Sử dụng đúng endpoint xác thực user
        const apiUrl = import.meta.env.VITE_API_USER || "";
        const url = apiUrl ? `${apiUrl}/user/me` : "/api/user/me";
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
      setAuthChecked(true);
    };
    checkAuth();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.elements[0].value,
      email: e.target.elements[1].value,
      message: e.target.elements[2].value
    };
    
    try {
      await HomePageService.sendContactMessage(formData);
      alert('Tin nhắn của bạn đã được gửi thành công!');
      e.target.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau!');
    }
  };

  // Filter resources based on auth status
  const filteredResources = healthResources.filter(
    (resource) => !resource.restricted || isAuthenticated
  );

  return (
    <div className="home-page" id="home">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button className="backtotop-fixed" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} title="Lên đầu trang">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
      )}
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="services-badge">
                <span className="services-badge-icon">🏫</span>
                Trường Tiểu Học Hàng Đầu
              </div>
              <h1 className="hero-title">
                 <span className="hero-title-highlight">Trường Tiểu Học FPT</span>
                <span className="hero-title-secondary">Chăm sóc sức khỏe toàn diện</span>
              </h1>
              <p className="hero-description">
                {schoolInfo.slogan || "Môi trường giáo dục hiện đại - Chăm sóc sức khỏe toàn diện cho học sinh. Với cơ sở vật chất hiện đại và đội ngũ giáo viên chuyên nghiệp."}
              </p>
              <div className="hero-buttons">
                <Link to="/about" className="btn-hero-primary">
                  Tìm hiểu thêm
                </Link>
                {authChecked && !isAuthenticated && (
                  <Link to="/login" className="btn-hero-secondary">
                    Đăng nhập
                  </Link>
                )}
              </div>
              
            </div>
            
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <div className="color-blob blob-1"></div>
                <div className="color-blob blob-2"></div>
                <div className="color-blob blob-3"></div>
                <img 
                  src={heroImage} 
                  alt="Professional Person"
                  className="hero-main-image"
                />
                <div className="floating-card floating-card-1">
                  <div className="card-icon">🏥</div>
                  <div className="card-text">Y tế chuyên nghiệp</div>
                </div>
                <div className="floating-card floating-card-2">
                  <div className="card-icon">📚</div>
                  <div className="card-text">Giáo dục chất lượng</div>
                </div>
                <div className="floating-card floating-card-3">
                  <div className="card-icon">🌟</div>
                  <div className="card-text">Môi trường an toàn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-grid">
            <div>
              <div className="services-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-badge-icon" aria-hidden="true"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
                Giới thiệu về trường
              </div>
              <h2 className="about-title">Môi trường học tập an toàn và chăm sóc sức khỏe toàn diện</h2>
              <p className="about-desc">Trường Tiểu học FPT không chỉ chú trọng phát triển học thuật mà còn đặt sức khỏe học sinh lên hàng đầu, kết hợp môi trường học tập hiện đại với dịch vụ y tế chuyên nghiệp, đảm bảo học sinh được chăm sóc toàn diện cả về trí tuệ lẫn thể chất.</p>
              <div className="about-reasons">
                <div className="about-reason">
                  <div className="about-reason-icon bg-green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="about-reason-svg"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                  </div>
                  <div>
                    <h3 className="about-reason-title">2000+ Học sinh</h3>
                    <p className="about-reason-desc">Môi trường học tập hiện đại, an toàn và thân thiện.</p>
          </div>
                </div>
                <div className="about-reason">
                  <div className="about-reason-icon bg-green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="about-reason-svg"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
                  </div>
                  <div>
                    <h3 className="about-reason-title">150+ Giáo viên</h3>
                    <p className="about-reason-desc">Giáo viên tận tâm, luôn đồng hành cùng học sinh.</p>
                  </div>
                </div>
                <div className="about-reason">
                  <div className="about-reason-icon bg-green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="about-reason-svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="about-reason-title">10+ Nhân viên y tế</h3>
                    <p className="about-reason-desc">Chăm sóc sức khỏe chuyên nghiệp, hỗ trợ y tế kịp thời.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-image-wrapper">
              <img src={aboutImage} alt="Trường Tiểu học FPT" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Health Resources Section */}
      <section id="services" className="services-section">
        <div className="services-container">
          <div className="services-header">
            <div className="services-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-badge-icon"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>
              Dịch vụ chăm sóc sức khỏe
            </div>
            <h2 className="services-title">Dịch vụ y tế học đường</h2>
            <p className="services-desc">Các dịch vụ chăm sóc và quản lý sức khỏe cho học sinh</p>
          </div>
          <div className="services-grid">
            {/* Card 1: Hồ Sơ Sức Khỏe */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <h3 className="services-card-title">Hồ Sơ Sức Khỏe</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Quản lý thông tin sức khỏe cá nhân</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Lưu trữ lịch sử khám chữa bệnh</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Truy xuất nhanh hồ sơ học sinh</li>
              </ul>
                </div>
            {/* Card 2: Khai Báo Thuốc */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
              </div>
              <h3 className="services-card-title">Khai Báo Thuốc</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Khai báo thuốc sử dụng cá nhân</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Quản lý đơn thuốc học sinh</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Đảm bảo an toàn sử dụng thuốc</li>
              </ul>
                </div>
            {/* Card 3: Sự Kiện Y Tế */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-darkgreen">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
              </div>
              <h3 className="services-card-title">Sự Kiện Y Tế</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Cập nhật sự kiện y tế mới nhất</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Thông báo tai nạn, sự cố</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Lịch sử sự kiện theo năm học</li>
              </ul>
                </div>
            {/* Card 4: Tiêm Chủng */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-yellow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
              </div>
              <h3 className="services-card-title">Tiêm Chủng</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Quản lý lịch sử tiêm chủng</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Nhắc nhở lịch tiêm định kỳ</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Báo cáo tiêm chủng toàn trường</li>
              </ul>
                </div>
            {/* Card 5: Kiểm Tra Định Kỳ */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <path d="M9 10h6"/>
                  <path d="M9 14h2"/>
                  <path d="M15 14h.01"/>
                </svg>
              </div>
              <h3 className="services-card-title">Kiểm Tra Định Kỳ</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Lịch kiểm tra sức khỏe định kỳ</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Kết quả kiểm tra từng học sinh</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Thống kê sức khỏe toàn trường</li>
              </ul>
                </div>
            {/* Card 6: Quản Lý Thuốc */}
            <div className="services-card">
              <div className="services-card-icon services-card-icon-indigo">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-card-svg"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              </div>
              <h3 className="services-card-title">Quản Lý Thuốc</h3>
              <ul className="services-card-desc services-card-list">
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Quản lý kho thuốc, vật tư y tế</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Kiểm kê, xuất nhập thuốc</li>
                <li><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="services-li-check"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>Báo cáo tồn kho, sử dụng</li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* Blog Section */}
      <section id="blog" className="blog-section">
      <Blog blogPosts={blogPosts} isLoading={isLoading} />
      </section>
      {/* Contact Section */}
      {/* <section className="section contact-section" id="contact">
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
      </section> */}
      
    </div>
  );
}

