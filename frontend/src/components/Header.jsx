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
            <li><Link to="/hososuckhoe">Hồ Sơ Sức Khỏe</Link></li>
            <li><Link to="/khaibaothuoc">Khai Báo Thuốc</Link></li>
            <li><Link to="/sukienyte">Sự Kiện Y Tế</Link></li>
            <li><Link to="/quanlytiemchung">Quản Lý Tiêm Chủng</Link></li>
            <li><Link to="/thongbaotiemchung">Thông Báo Tiêm Chủng</Link></li>
            <li><Link to="/kiemtradinhky">Kiểm Tra Định Kỳ</Link></li>
            <li><Link to="/quanlythuoc">Quản Lý Thuốc</Link></li>
            <li><Link to="/login">Đăng nhập</Link></li>
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
