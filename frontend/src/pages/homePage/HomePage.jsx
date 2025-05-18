import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import HomePageService from "../../services/HomePageService";

export default function HomePage() {
  // State for health resources
  const [healthResources, setHealthResources] = useState([]);
  // State for blog posts
  const [blogPosts, setBlogPosts] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for auth status (temporary)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          {
            id: 3,
            title: "Dinh dưỡng học đường cho trẻ em",
            type: "guide",
            thumbnail: "https://placehold.co/600x400",
            createdAt: "2023-06-10",
          },
          {
            id: 4,
            title: "Quy trình xử lý sự cố y tế tại trường",
            type: "document",
            thumbnail: "https://placehold.co/600x400",
            createdAt: "2023-03-05",
            restricted: true,
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
          {
            id: 2,
            title: "Tầm quan trọng của bữa sáng đối với học sinh",
            excerpt: "Nhiều nghiên cứu đã chỉ ra rằng bữa sáng là bữa ăn quan trọng nhất trong ngày...",
            author: "BS. Trần Văn Khỏe",
            thumbnail: "https://placehold.co/600x400",
            publishedAt: "2023-05-20",
          },
          {
            id: 3,
            title: "Cách phát hiện sớm các vấn đề về thị lực ở trẻ",
            excerpt: "Thị lực kém có thể ảnh hưởng nghiêm trọng đến khả năng học tập của trẻ...",
            author: "BS. Lê Thị Nhãn",
            thumbnail: "https://placehold.co/600x400",
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
          name: "Trường Trung Học Phổ Thông ABC",
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

    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{schoolInfo.name || "Trường Trung Học Phổ Thông ABC"}</h1>
          <p>{schoolInfo.slogan || "Chăm sóc sức khỏe toàn diện cho học sinh"}</p>
          <div className="hero-buttons">
            <Link to="/about" className="btn btn-primary">
              Tìm hiểu thêm
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-secondary">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section school-intro">
        <div className="container">
          <div className="section-header">
            <h2>Giới thiệu về trường</h2>
            <p>Môi trường học tập an toàn và chăm sóc sức khỏe toàn diện</p>
          </div>
          <div className="intro-content">
            <div className="intro-text">
              <p>
                Trường THPT ABC được thành lập vào năm 2000, với sứ mệnh đào tạo
                học sinh toàn diện cả về tri thức và sức khỏe. Chúng tôi tự hào
                với đội ngũ y tế học đường chuyên nghiệp, luôn sẵn sàng chăm sóc
                sức khỏe cho học sinh.
              </p>
              <p>
                Với cơ sở vật chất hiện đại và không gian học tập xanh, sạch,
                đẹp, chúng tôi cam kết mang đến môi trường giáo dục tốt nhất cho
                con em quý phụ huynh.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{schoolInfo.stats?.students || "2000+"}</span>
                  <span className="stat-label">Học sinh</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{schoolInfo.stats?.teachers || "150+"}</span>
                  <span className="stat-label">Giáo viên</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{schoolInfo.stats?.medicalStaff || "10+"}</span>
                  <span className="stat-label">Nhân viên y tế</span>
                </div>
              </div>
            </div>
            <div className="intro-image">
              <img
                src={schoolInfo.imageUrl || "https://placehold.co/600x400"}
                alt={schoolInfo.name || "Trường THPT ABC"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Health Resources Section - REPLACED WITH FEATURES */}
      <section className="section health-resources">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ y tế học đường</h2>
            <p>Các dịch vụ chăm sóc và quản lý sức khỏe cho học sinh</p>
          </div>

          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <div className="resources-grid">
              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Hồ Sơ Sức Khỏe" />
                  <span className="resource-type guide">Học sinh</span>
                </div>
                <div className="resource-info">
                  <h3>Hồ Sơ Sức Khỏe</h3>
                  <p className="resource-date">Quản lý thông tin sức khỏe cá nhân học sinh</p>
                  <Link to="/hososuckhoe" className="btn btn-sm">
                    Truy cập
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Khai Báo Thuốc" />
                  <span className="resource-type guide">Học sinh</span>
                </div>
                <div className="resource-info">
                  <h3>Khai Báo Thuốc</h3>
                  <p className="resource-date">Khai báo thông tin thuốc sử dụng tại trường</p>
                  <Link to="/khaibaothuoc" className="btn btn-sm">
                    Truy cập
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Sự Kiện Y Tế" />
                  <span className="resource-type guide">Học sinh</span>
                </div>
                <div className="resource-info">
                  <h3>Sự Kiện Y Tế</h3>
                  <p className="resource-date">Xem các sự kiện y tế và tai nạn tại trường</p>
                  <Link to="/sukienyte" className="btn btn-sm">
                    Truy cập
                  </Link>
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Tiêm Chủng" />
                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Tiêm Chủng</h3>
                  <p className="resource-date">Quản lý thông tin tiêm chủng của học sinh</p>
                  {isAuthenticated ? (
                    <Link to="/tiemchung" className="btn btn-sm">
                      Truy cập
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-sm">
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Kiểm Tra Định Kỳ" />
                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Kiểm Tra Định Kỳ</h3>
                  <p className="resource-date">Lịch và kết quả kiểm tra sức khỏe định kỳ</p>
                  {isAuthenticated ? (
                    <Link to="/kiemtradinhky" className="btn btn-sm">
                      Truy cập
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-sm">
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>

              <div className="resource-card">
                <div className="resource-thumbnail">
                  <img src="https://placehold.co/600x400" alt="Quản Lý Thuốc" />
                  <span className="resource-type document">Quản lý</span>
                </div>
                <div className="resource-info">
                  <h3>Quản Lý Thuốc</h3>
                  <p className="resource-date">Hệ thống quản lý thuốc và vật tư y tế</p>
                  {isAuthenticated ? (
                    <Link to="/quanlythuoc" className="btn btn-sm">
                      Truy cập
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-sm">
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="resources-login-prompt">
              <p>
                Đăng nhập để truy cập đầy đủ các tính năng quản lý y tế của trường
              </p>
              <Link to="/login" className="btn btn-secondary">
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="section blog-section">
        <div className="container">
          <div className="section-header">
            <h2>Blog và chia sẻ kinh nghiệm</h2>
            <p>Kiến thức và lời khuyên từ đội ngũ y tế chuyên nghiệp</p>
          </div>

          {isLoading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <div className="blog-posts">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <div key={post.id} className="blog-post">
                    <div className="post-thumbnail">
                      <img src={post.thumbnail} alt={post.title} />
                    </div>
                    <div className="post-content">
                      <h3>{post.title}</h3>
                      <p className="post-meta">
                        <span className="post-author">{post.author}</span>
                        <span className="post-date">
                          {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </p>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <Link to={`/blog/${post.id}`} className="read-more">
                        Đọc tiếp
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">Không có bài viết nào.</div>
              )}
            </div>
          )}

          <div className="blog-footer">
            <Link to="/blog" className="btn btn-primary">
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </section>

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
            <div className="contact-form">
              <h3>Gửi tin nhắn cho chúng tôi</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Nội dung tin nhắn"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
