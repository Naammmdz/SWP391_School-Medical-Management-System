import React, { useState } from "react";
import "./Login.css";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../../services/UserService';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!emailOrPhone || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      setLoginError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    try {
      const loginData = { emailOrPhone, password };
      const response = await userService.login(loginData);

      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.accessToken);

      toast.success('Đăng nhập thành công!');
      
      // Tự động làm mới trang sau khi đăng nhập thành công
      setTimeout(() => window.location.reload(), 800);
     


      
      switch (response.data.userRole) {
        
        case 'ROLE_ADMIN':
          // Add local storage student list if role is admin and nurse
          localStorage.setItem('students', JSON.stringify(response.data.students || []));
          navigate('/admin');

          break;
        case 'ROLE_PARENT':
          navigate('/parent');
          break;
        case 'ROLE_NURSE':
          // Add local storage student list if role is nurse
          localStorage.setItem('students', JSON.stringify(response.data.students || []));
          navigate('/nurse');
          break;
        case 'ROLE_PRINCIPAL':
          // Add local storage student list if role is principal
          localStorage.setItem('students', JSON.stringify(response.data.students || []));
          navigate('/principal');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.log("Lỗi trả về từ backend:", error);
      const errMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      toast.error(errMsg);
      setLoginError(errMsg);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      {/* Background decorations */}
      <div className="login-background-decorations">
        <div className="login-decoration login-decoration-1"></div>
        <div className="login-decoration login-decoration-2"></div>
        <div className="login-decoration login-decoration-3"></div>
      </div>

      <div className="login-content-wrapper">
        <div className="login-grid-container">
          {/* Left side - Branding & Information */}
          <div className="login-branding-section">
            <div className="login-back-link-wrapper">
              <Link to="/" className="login-back-link">
                <svg className="login-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại trang chủ
              </Link>
            </div>
            
            <div className="login-brand-header">
              <div className="login-brand-icon">
                <svg className="login-health-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="login-brand-text">
                <h1 className="login-brand-title">Trường Tiểu Học FPT</h1>
                <p className="login-brand-description">Hệ thống quản lý y tế</p>
              </div>
            </div>

            <h2 className="login-welcome-title">
              Chào mừng trở lại với 
              <span className="login-title-highlight">hệ thống y tế trường</span>
            </h2>
            
            <p className="login-welcome-subtitle">
              Đăng nhập để truy cập vào hệ thống quản lý sức khỏe hiện đại của trường tiểu học FPT.
            </p>

            {/* Features */}
            <div className="login-features-list">
              <div className="login-feature-item">
                <div className="login-feature-icon-wrapper">
                  <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Bảo mật tuyệt đối</h3>
                  <p className="login-feature-description">Thông tin được mã hóa và bảo vệ</p>
                </div>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon-wrapper">
                  <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Chăm sóc toàn diện</h3>
                  <p className="login-feature-description">Theo dõi sức khỏe 24/7</p>
                </div>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-icon-wrapper">
                  <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Chuyên nghiệp</h3>
                  <p className="login-feature-description">Đội ngũ y tế giàu kinh nghiệm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="login-form-section">
            {/* Mobile header */}
            <div className="login-mobile-header">
              <div className="login-mobile-brand-header">
                <div className="login-mobile-brand-icon">
                  <svg className="login-health-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="login-mobile-brand-text">
                  <h1 className="login-mobile-brand-title">Trường Tiểu Học FPT</h1>
                  <p className="login-mobile-brand-description">Hệ thống y tế</p>
                </div>
              </div>
              <Link to="/" className="login-mobile-back-link">
                <svg className="login-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại trang chủ
              </Link>
            </div>

            <div className="login-form-container">
              {/* Form header */}
              <div className="login-form-header">
                <h2 className="login-form-title">Xin chào!</h2>
                <p className="login-form-subtitle">Vui lòng đăng nhập để tiếp tục</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                {/* Username field */}
                <div className="login-form-group">
                  <label className="login-form-label" htmlFor="emailOrPhone">
                    Email hoặc số điện thoại
                  </label>
                  <div className="login-input-wrapper">
                    <input
                      type="text"
                      id="emailOrPhone"
                      className="login-form-input"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="Nhập email hoặc số điện thoại"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="login-form-group">
                  <label className="login-form-label" htmlFor="password">
                    Mật khẩu
                  </label>
                  <div className="login-input-wrapper login-has-toggle">
                    <input
                      type={isShowPassword ? 'text' : 'password'}
                      id="password"
                      className="login-form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.759 7.759M12 12l2.122-2.122m0 0L16.243 7.759M12 12l-2.122 2.122m2.122-2.122l2.121 2.121" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {loginError && (
                  <div className="login-error-message">
                    <p>{loginError}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`login-sign-in-button ${isLoading ? 'login-loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <div className="login-loading-spinner"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      Đăng nhập
                      <svg className="login-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Additional links */}
              <div className="login-form-footer">
                <div className="login-footer-links">
                  <a href="#" className="login-footer-link">
                    Quên mật khẩu?
                  </a>
                  <span className="login-link-separator">|</span>
                  <a href="#" className="login-footer-link">
                    Hỗ trợ kỹ thuật
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;