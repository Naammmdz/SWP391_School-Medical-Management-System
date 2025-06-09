import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { Bell, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [studentHealthOpen, setStudentHealthOpen] = useState(false);
  const [medicalEventsOpen, setMedicalEventsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const studentHealthRef = useRef(null);
  const medicalEventsRef = useRef(null);
  const userDropdownRef = useRef(null);

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
      localStorage.removeItem('user');
    }

    const handleClickOutside = (event) => {
      if (
        studentHealthRef.current &&
        !studentHealthRef.current.contains(event.target)
      ) {
        setStudentHealthOpen(false);
      }
      if (
        medicalEventsRef.current &&
        !medicalEventsRef.current.contains(event.target)
      ) {
        setMedicalEventsOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const closeDropdowns = () => {
    setStudentHealthOpen(false);
    setMedicalEventsOpen(false);
    setIsMenuOpen(false);
  };

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

          <li className="dropdown" ref={studentHealthRef}>
            <button
              className="nav-dropdown-btn"
              aria-haspopup="true"
              aria-expanded={studentHealthOpen}
              onClick={() => setStudentHealthOpen((prev) => !prev)}
              type="button"
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              Sức khỏe học sinh
              <span className="dropdown-arrow" style={{ marginLeft: 6 }}>▼</span>
            </button>
            {studentHealthOpen && (
              <div className="user-dropdown-menu" tabIndex={0}>
                <Link to="/hososuckhoe" className="dropdown-item" onClick={() => setStudentHealthOpen(false)}>
                  Hồ Sơ Sức Khỏe
                </Link>
                <Link to="/khaibaothuoc" className="dropdown-item" onClick={() => setStudentHealthOpen(false)}>
                  Khai Báo Thuốc
                </Link>
              </div>
            )}
          </li>

          <li className="dropdown" ref={medicalEventsRef}>
            <button
              className="nav-dropdown-btn"
              aria-haspopup="true"
              aria-expanded={medicalEventsOpen}
              onClick={() => setMedicalEventsOpen((prev) => !prev)}
              type="button"
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              Sự kiện y tế
              <span className="dropdown-arrow" style={{ marginLeft: 6 }}>▼</span>
            </button>
            {medicalEventsOpen && (
              <div className="user-dropdown-menu" tabIndex={0}>
                <Link to="/sukienyte" className="dropdown-item" onClick={() => setMedicalEventsOpen(false)}>
                  Sự Kiện Y Tế
                </Link>
                <Link to="/quanlytiemchung" className="dropdown-item" onClick={() => setMedicalEventsOpen(false)}>
                  Quản Lý Tiêm Chủng
                </Link>
                <Link to="/thongbaotiemchung" className="dropdown-item" onClick={() => setMedicalEventsOpen(false)}>
                  Thông Báo Tiêm Chủng
                </Link>
                <Link to="/kiemtradinhky" className="dropdown-item" onClick={() => setMedicalEventsOpen(false)}>
                  Kiểm Tra Định Kỳ
                </Link>
              </div>
            )}
          </li>

          <li><Link to="/quanlythuoc" onClick={closeDropdowns}>Quản Lý Thuốc</Link></li>
          <li><Link to="/donthuoc" onClick={closeDropdowns}>Đơn Thuốc</Link></li>
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
              ref={userDropdownRef}
            >
              <span className="username">
                Xin chào, {user ? (user.fullName || user.email) : "Khách"}
              </span>
              <span className="user-role">
                {user ? (user.userRole || user.role) : " "}
              </span>
              <span className="dropdown-arrow" style={{ marginLeft: 6 }}>▼</span>

              {showUserDropdown && (
                <div className="user-dropdown-menu">
                  <Link
                    to="/capnhatthongtin"
                    className="dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    👤 Cập nhật thông tin
                  </Link>
                  <Link
                    to="/doimatkhau"
                    className="dropdown-item"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    🔒 Đổi mật khẩu
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowUserDropdown(false);
                      alert("Liên hệ hỗ trợ qua email hoặc hotline!");
                    }}
                  >
                    ❓ Trợ giúp và hỗ trợ
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowUserDropdown(false);
                      alert("Cảm ơn bạn đã đóng góp ý kiến!");
                    }}
                  >
                    💬 Đóng góp ý kiến
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
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
