import React from "react";
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

const Header = () => (
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
      <a className="header-btn header-btn-primary" href="/login">Đăng nhập</a>
          </div>
        </div>
);

export default Header;