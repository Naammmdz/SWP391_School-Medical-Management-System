import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer-green">
      <div className="footer-green-container">
        <div className="footer-green-grid">
          <div className="footer-green-info">
            <div className="footer-green-brand">
              <div className="footer-green-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-green-logo-icon"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg>
              </div>
              <div>
                <span className="footer-green-title">Trường Tiểu Học FPT</span>
                <div className="footer-green-sub">Hệ thống quản lý y tế</div>
              </div>
            </div>
            <p className="footer-green-desc">Hệ thống quản lý sức khỏe hiện đại của trường tiểu học FPT, cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho học sinh.</p>
            <div className="footer-green-social">
              <a href="#" className="footer-green-social-btn">f</a>
              <a href="#" className="footer-green-social-btn">t</a>
              <a href="#" className="footer-green-social-btn">in</a>
              <a href="#" className="footer-green-social-btn">yt</a>
            </div>
          </div>
          <div>
            <h3 className="footer-green-heading">Dịch vụ</h3>
            <ul className="footer-green-list">
              <li><a href="#" className="footer-green-link">Quản lý hồ sơ sức khỏe</a></li>
              <li><a href="#" className="footer-green-link">Lập lịch khám bệnh</a></li>
              <li><a href="#" className="footer-green-link">Hệ thống thông báo</a></li>
              <li><a href="#" className="footer-green-link">Báo cáo thống kê</a></li>
              <li><a href="#" className="footer-green-link">Quản lý thuốc</a></li>
            </ul>
          </div>
          <div>
            <h3 className="footer-green-heading">Hỗ trợ</h3>
            <ul className="footer-green-list">
              <li><a href="#" className="footer-green-link">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="footer-green-link">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="footer-green-link">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="footer-green-link">Liên hệ hỗ trợ</a></li>
              <li><a href="#" className="footer-green-link">Đào tạo người dùng</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-green-contact">
          <div className="footer-green-contact-item">
            <div className="footer-green-contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
            </div>
            <div>
              <div className="footer-green-contact-title">Y tế trường</div>
              <div className="footer-green-contact-desc">(028) 3875 1234</div>
            </div>
          </div>
          <div className="footer-green-contact-item">
            <div className="footer-green-contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
            </div>
            <div>
              <div className="footer-green-contact-title">Email y tế</div>
              <div className="footer-green-contact-desc">yte@tthfpt.edu.vn</div>
            </div>
          </div>
          <div className="footer-green-contact-item">
            <div className="footer-green-contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <div className="footer-green-contact-title">Địa chỉ trường</div>
              <div className="footer-green-contact-desc">123 Đường Nguyễn Du, Quận 1, TP.HCM</div>
            </div>
          </div>
        </div>
        <div className="footer-green-bottom">
          <div className="footer-green-copyright">
            © {new Date().getFullYear()} Trường Tiểu Học FPT. Tất cả quyền được bảo lưu.
          </div>
          <div className="footer-green-policy">
            <a href="#" className="footer-green-link">Chính sách bảo mật</a>
            <a href="#" className="footer-green-link">Điều khoản sử dụng</a>
            <a href="#" className="footer-green-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
