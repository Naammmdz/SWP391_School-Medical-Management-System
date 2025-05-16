import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { Bell, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <li><Link to="/">Trang Chủ</Link></li>
            <li className="dropdown">
              <span className="nav-dropdown-trigger">Sức Khỏe Học Sinh</span>
              <div className="dropdown-content">
                <Link to="/hososuckhoe">Hồ Sơ Sức Khỏe</Link>
                <Link to="/khaibaothuoc">Khai Báo Thuốc</Link>
                <Link to="/sukienyte">Sự Kiện Y Tế</Link>
              </div>
            </li>
            <li className="dropdown">
              <span className="nav-dropdown-trigger">Quản Lý Y Tế</span>
              <div className="dropdown-content">
                <Link to="/tiem-chung">Tiêm Chủng</Link>
                <Link to="/kiem-tra-dinh-ky">Kiểm Tra Định Kỳ</Link>
                <Link to="/quan-ly-thuoc">Quản Lý Thuốc</Link>
              </div>
            </li>
            <li><Link to="/bao-cao">Báo Cáo</Link></li>
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
                <span className="user-role">Nhân viên y tế</span>
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
