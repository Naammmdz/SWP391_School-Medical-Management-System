import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="footer-text">
          &copy; {new Date().getFullYear()} Y Tế Học Đường. All rights reserved.
        </span>
        <span className="footer-links">
          
          <a href="/blog" className="footer-link">Blog</a>
          <a href="/lien-he" className="footer-link">Liên hệ</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
