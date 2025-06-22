import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ParentPages.css";
import HomePageService from "../../services/HomePageService";

import Blog from "../home/Blog/Blog";
import heroImage from "../../assets/images/fpt.jpg";
import studentService from "../../services/StudentService";

export default function ParentPages() {
  const [healthResources, setHealthResources] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState({});
  const [studentList, setStudentList] = useState([]);
   const [studentCardsDisabled, setStudentCardsDisabled] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(
    localStorage.getItem("selectedStudentId") || ""
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Lấy danh sách con của phụ huynh
  useEffect(() => {
    if (user.userRole === "ROLE_PARENT") {
      studentService.getStudentByParentID(user.userId, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setStudentList(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => setStudentList([]));
    }
  }, [user, token]);

  // Khi chọn con, lưu vào localStorage để các trang khác dùng
  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentId", studentId);
  };
 const handleStudentCardClick = (studentId) => {
  if (!studentCardsDisabled) {
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentId", studentId);
    // Lưu thêm object student vào localStorage
    const selectedStudent = studentList.find(s => s.studentId === studentId);
    if (selectedStudent) {
      localStorage.setItem("selectedStudentInfo", JSON.stringify(selectedStudent));
    }
    setStudentCardsDisabled(true);
    //window.location.reload();
  } else if (studentId === selectedStudentId) {
    // Nếu click lại vào card đã chọn thì mở lại tất cả card
    setSelectedStudentId("");
    localStorage.removeItem("selectedStudentId");
    localStorage.removeItem("selectedStudentInfo");
    setStudentCardsDisabled(false);
  }
};
  useEffect(() => {
    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const data = await HomePageService.getBlogPosts();
        setBlogPosts(data);
      } catch (error) {
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
          backgroundSize: "100% auto",
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

      {/* Chọn con */}
  {user.userRole === "ROLE_PARENT" && (
    <section className="section select-student-section">
      <div className="container">
        <div className="form-group">
          <label style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, display: "block" }}>
            Chọn học sinh để xem thông tin:
          </label>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {studentList.length === 0 && (
              <div style={{ color: "#888" }}>Không có học sinh nào.</div>
            )}
            {studentList.map((student) => {
              const isSelected = student.studentId === selectedStudentId;
              const isDisabled = studentCardsDisabled && !isSelected;
              return (
                <div
                  key={student.studentId}
                  onClick={() => !isDisabled && handleStudentCardClick(student.studentId)}
                  style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
                    border: isSelected ? "2px solid #2563eb" : "1px solid #eee",
                    borderRadius: 12,
                    padding: "18px 28px",
                    background: isSelected ? "#e0e7ff" : "#fff",
                    boxShadow: isSelected
                      ? "0 4px 16px rgba(37,99,235,0.08)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.2s",
                    minWidth: 220,
                    minHeight: 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    position: "relative",
                    pointerEvents: isDisabled ? "none" : "auto"
                  }}
                  className="student-card"
                >
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#2563eb" }}>
                    {student.fullName}
                  </div>
                  <div style={{ fontSize: 15, color: "#555", marginTop: 4 }}>
                    Lớp: <b>{student.className}</b>
                  </div>
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 16,
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: 12,
                        padding: "2px 10px"
                      }}
                    >
                      Đã chọn
                    </span>
                  )}
                  {isSelected && studentCardsDisabled && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 16,
                        background: "#f59e42",
                        color: "#fff",
                        borderRadius: 8,
                        fontSize: 11,
                        padding: "2px 8px"
                      }}
                    >
                      Nhấn lại để chọn học sinh khác
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {selectedStudentId && (
          <div style={{ marginTop: 12 }}>
            {/* Có thể hiển thị thông tin phụ hoặc hướng dẫn ở đây nếu muốn */}
          </div>
        )}
      </div>
    </section>
  )}

      {/* Health Resources Section */}
      <section className="section health-resources">
        <div className="container">
          <div className="section-header">
            <h2>Dịch vụ y tế học đường</h2>
            <p>Các dịch vụ chăm sóc và quản lý sức khỏe cho học sinh</p>
          </div>
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
                <img src="https://th.bing.com/th/id/OIP.Ze3TuiOXtRqnq7qRQQKOzwHaEU?w=281&h=180&c=7&r=0&o=5&cb=iwc2&dpr=2&pid=1.7" alt="Tiêm Chủng" />
                <span className="resource-type document">Thông báo</span>
              </div>
              <div className="resource-info">
                <h3>Kết quả Tiêm Chủng</h3>
                <p className="resource-date">Xem kết quả tiêm chủng</p>
                <Link to="/ketquatiemchunghocsinh" className="btn btn-sm">
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
                <Link to="/kiemtradinhkyhocsinh" className="btn btn-sm">
                  Xem chi tiết
                </Link>
              </div>
            </div>
 
              <div className="resource-card">
              <div className="resource-thumbnail">
                <img src="https://th.bing.com/th/id/OIP.X-QvddXj6_0IDp9_nHVYswHaE7?w=265&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3" alt="Khai Báo Thuốc" />
                <span className="resource-type document">Thông báo</span>
              </div>
              <div className="resource-info">
                <h3>Khai Báo Thuốc</h3>
                <p className="resource-date">Khai Báo Thuốc cho nhà trường</p>
                <Link to="/khaibaothuoc" className="btn btn-sm">
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
                <h3>Kết Quả Kiểm Tra Định Kỳ</h3>
                <p className="resource-date">Xem và xác nhận kết quả kiểm tra sức khỏe</p>
                <Link to="/ketquakiemtradinhkyhocsinh" className="btn btn-sm">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
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