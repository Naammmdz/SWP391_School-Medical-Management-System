import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const handleSmoothScroll = (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsAuthenticated(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavigationOptions = () => {
    if (!user) return [];
    
    const roleOptions = {
      ROLE_ADMIN: [
        { path: "/thongke", label: "Bảng điều khiển" },
        { path: "/admin", label: "Quản trị hệ thống" },
        { path: "/danhsachnguoidung", label: "Quản lý người dùng" },
        { path: "/danhsachhocsinh", label: "Quản lý học sinh" },
        { path: "/quanlytiemchung", label: "Quản lý tiêm chủng" }
      ],
      ROLE_NURSE: [
        { path: "/thongke", label: "Bảng điều khiển" },
        { path: "/nurse", label: "Trang Y tá" },
        { path: "/hososuckhoe", label: "Hồ sơ sức khỏe" },
        { path: "/donthuoc", label: "Đơn thuốc" },
        { path: "/sukienyte", label: "Sự kiện y tế" }
      ],
      ROLE_PARENT: [
        { path: "/parent", label: "Trang chính phụ huynh" },
        { path: "/hososuckhoe", label: "Hồ sơ sức khỏe" },
        { path: "/khaibaothuoc", label: "Khai báo thuốc" },
        { path: "/donthuocdagui", label: "Đơn thuốc đã gửi" },
        { path: "/capnhatthongtin", label: "Cập nhật thông tin" }
      ],
      ROLE_PRINCIPAL: [
        { path: "/principal", label: "Bảng điều khiển" },
        { path: "/thongke", label: "Thống kê" },
        { path: "/danhsachnguoidung", label: "Quản lý người dùng" },
        { path: "/danhsachhocsinh", label: "Quản lý học sinh" },
        { path: "/quanlytiemchung", label: "Quản lý tiêm chủng" },
        { path: "/danhsachkiemtradinhky", label: "Kiểm tra sức khỏe" },
        { path: "/sukienyte", label: "Sự kiện y tế" },
        { path: "/quanlyvattuyte", label: "Quản lý vật tư y tế" },
        { path: "/donthuoc", label: "Đơn thuốc" }
      ]
    };
    
    return roleOptions[user.userRole] || [];
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <div className="header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-logo-icon" aria-hidden="true">
            <path d="M11 2v2"></path>
            <path d="M5 2v2"></path>
            <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
            <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
            <circle cx="20" cy="10" r="2"></circle>
          </svg>
        </div>
        <div>
          <span className="header-title">Trường Tiểu Học FPT</span>
          <div className="header-slogan">Hệ thống quản lý y tế</div>
        </div>
      </div>
      <nav className="header-nav">
        <a href="#home" className="header-link" onClick={handleSmoothScroll}>Trang chủ</a>
        <a href="#about" className="header-link" onClick={handleSmoothScroll}>Về chúng tôi</a>
        <a href="#services" className="header-link" onClick={handleSmoothScroll}>Dịch vụ</a>
        <a href="#blog" className="header-link" onClick={handleSmoothScroll}>Blog</a>
        <a href="#contact" className="header-link" onClick={handleSmoothScroll}>Liên hệ</a>
      </nav>
      <div className="header-actions">
        {isAuthenticated ? (
          <div className="dropdown">
            <button 
              className={`menu-btn ${isDropdownOpen ? 'active' : ''}`}
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              ☰
            </button>
            <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
              {getNavigationOptions().map((option, index) => (
                <Link 
                  key={index} 
                  to={option.path}
                  onClick={handleLinkClick}
                >
                  {option.label}
                </Link>
              ))}
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          </div>
        ) : (
          <a className="header-btn header-btn-primary" href="/login">Đăng nhập</a>
        )}
      </div>
    </div>
  );
};

export default Header;
