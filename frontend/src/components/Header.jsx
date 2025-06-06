import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { Bell, User, Menu, X } from 'lucide-react';
import userService from '../services/UserService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [studentHealthOpen, setStudentHealthOpen] = useState(false);
  const [medicalEventsOpen, setMedicalEventsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // Thông tin user từ localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      if (userData && userData !== "undefined" && userData !== "null") {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user'); // Xóa dữ liệu lỗi để tránh lặp lại lỗi
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdowns on nav click (for mobile UX)
  const closeDropdowns = () => {
    setStudentHealthOpen(false);
    setMedicalEventsOpen(false);
    setIsMenuOpen(false);
  };

  const handleDropdownToggle = (dropdownType) => {
    if (isMobile) {
      // On mobile, toggle the dropdown
      if (dropdownType === 'studentHealth') {
        setStudentHealthOpen(!studentHealthOpen);
        setMedicalEventsOpen(false);
      } else {
        setMedicalEventsOpen(!medicalEventsOpen);
        setStudentHealthOpen(false);
      }
    }
    // On desktop, do nothing as it's handled by onMouseEnter/onMouseLeave
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  let homeLink = '/';
  if (user && user.userRole) {
    switch (user.userRole.toUpperCase()) {
      case 'ROLE_ADMIN':
        homeLink = '/admin';
        break;
      case 'ROLE_PARENT':
        homeLink = '/parent';
        break;
      case 'ROLE_NURSE':
        homeLink = '/nurse';
        break;
      default:
        homeLink = '/';
    }
  }

  return (
    <header className="header">
      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to={homeLink} onClick={closeDropdowns}>Trang Chủ</Link></li>
          <li className="dropdown"
            onMouseEnter={() => !isMobile && setStudentHealthOpen(true)}
            onMouseLeave={() => !isMobile && setStudentHealthOpen(false)}
          >
            <button
              className="nav-dropdown-btn"
              aria-haspopup="true"
              aria-expanded={studentHealthOpen}
              onClick={() => handleDropdownToggle('studentHealth')}
              type="button"
            >
              Sức khỏe học sinh
              <span className="dropdown-arrow">▼</span>
            </button>
            {studentHealthOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/hososuckhoe" onClick={closeDropdowns}>Hồ Sơ Sức Khỏe</Link></li>
                <li><Link to="/khaibaothuoc" onClick={closeDropdowns}>Khai Báo Thuốc</Link></li>
              </ul>
            )}
          </li>
          <li className="dropdown"
            onMouseEnter={() => !isMobile && setMedicalEventsOpen(true)}
            onMouseLeave={() => !isMobile && setMedicalEventsOpen(false)}
          >
            <button
              className="nav-dropdown-btn"
              aria-haspopup="true"
              aria-expanded={medicalEventsOpen}
              onClick={() => handleDropdownToggle('medicalEvents')}
              type="button"
            >
              Sự kiện y tế
              <span className="dropdown-arrow">▼</span>
            </button>
            {medicalEventsOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/sukienyte" onClick={closeDropdowns}>Sự Kiện Y Tế</Link></li>
                <li><Link to="/quanlytiemchung" onClick={closeDropdowns}>Quản Lý Tiêm Chủng</Link></li>
                <li><Link to="/thongbaotiemchung" onClick={closeDropdowns}>Thông Báo Tiêm Chủng</Link></li>
                <li><Link to="/kiemtradinhky" onClick={closeDropdowns}>Kiểm Tra Định Kỳ</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/quanlythuoc" onClick={closeDropdowns}>Quản Lý Thuốc</Link></li>
          <li><Link to="/donthuoc" onClick={closeDropdowns}>Đơn Thuốc</Link></li>
          <li><Link to="/quanlynguoidung" onClick={closeDropdowns}>Quản lý người dùng</Link></li>
          {!user ? (
            <li><Link to="/login" onClick={closeDropdowns}>Đăng nhập</Link></li>
          ) : (
            <li><button onClick={handleLogout} className="logout-btn">Đăng xuất</button></li>
          )}
        </ul>
      </nav>

      <div className="header-right">
        <div className="user-controls">
          <button className="notifications-btn" aria-label="Thông báo">
            <Bell className="icon" />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="avatar-container">
              <User className="avatar-icon" />
            </div>
            <div
              className="username-role-dropdown"
              tabIndex={0}
              style={{ cursor: 'pointer', outline: 'none' }}
              onClick={() => setShowUserDropdown((prev) => !prev)}
              onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
            >
              <span className="username">
                Xin chào, {user ? (user.fullName || user.email) : "Khách"}
              </span>
              <span className="user-role">
                {user ? (user.userRole || user.role) : ""}
              </span>
              <span className="dropdown-arrow" style={{ marginLeft: 6 }}>▼</span>
              {showUserDropdown && (
                <div className="user-dropdown-menu">
                  <Link to="/capnhatthongtin" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                    <span role="img" aria-label="profile">👤</span> Cập nhật thông tin
                  </Link>
                  <button className="dropdown-item" type="button" onClick={() => { setShowUserDropdown(false); alert('Liên hệ hỗ trợ qua email hoặc hotline!'); }}>
                    <span role="img" aria-label="help">❓</span> Trợ giúp và hỗ trợ
                  </button>
                  <button className="dropdown-item" type="button" onClick={() => { setShowUserDropdown(false); alert('Cảm ơn bạn đã đóng góp ý kiến!'); }}>
                    <span role="img" aria-label="feedback">💬</span> Đóng góp ý kiến
                  </button>
                  <button className="dropdown-item" type="button" onClick={handleLogout}>
                    <span role="img" aria-label="logout">🚪</span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
        </button>
      </div>
    </header>
  );
};

export default Header;