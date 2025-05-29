import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { Bell, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [studentHealthOpen, setStudentHealthOpen] = useState(false);
  const [medicalEventsOpen, setMedicalEventsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="" className="logo">
            <span className="logo-text">Y Tế Học Đường</span>
            <span className="logo-subtext">Quản lý sức khỏe học sinh</span>
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={closeDropdowns}>Trang Chủ</Link></li>

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
            <li><Link to="/login" onClick={closeDropdowns}>Đăng nhập</Link></li>
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
              <div className="user-info">
                <span className="username">Xin chào, User</span>
                <span className="user-role"></span>
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
      </div>
    </header>
  );
};

export default Header;
