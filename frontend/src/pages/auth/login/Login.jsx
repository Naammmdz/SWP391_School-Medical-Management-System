import React, { useState } from "react";
import "./Login.css";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../../services/UserService';
import axios from "axios";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!emailOrPhone || !password) {
    toast.error('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  setIsLoading(true);
  try {
    const loginData = { emailOrPhone, password };
    console.log("Dữ liệu gửi lên backend:", loginData);

    const response = await userService.login(loginData);

    console.log("Dữ liệu trả về từ backend:", response.data);

    // Lưu thông tin user và token vào localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.accessToken);

  toast.success('Đăng nhập thành công!');
setTimeout(() => window.location.reload(), 800);

    // Điều hướng theo vai trò
    switch (response.data.userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'PARENT':
      case 'parent':
        navigate('/parent');
        break;
      case 'nurse':
        navigate('/nurse');
        break;
      default:
        navigate('/');
    }
    
  } catch (error) {
    console.log("Lỗi trả về từ backend:", error);
    toast.error(
      error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!'
    );
  }
  setIsLoading(false);
};

  return (
    <>
      <div className="login-container col-6">
        <div className="title">Đăng nhập</div>

        <form onSubmit={handleLogin}>
          <div className="text">Email hoặc Số điện thoại</div>
          <input
            type="text"
            placeholder="Nhập email hoặc số điện thoại"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />

          <div className="text">Mật khẩu</div>
          <div className="password-input">
            <input
              type={isShowPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? 'Ẩn' : 'Hiện'}
            </span>
          </div>

          <button
            className={emailOrPhone && password ? 'active' : ''}
            disabled={!emailOrPhone || !password || isLoading}
            type="submit"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <Link to="/" className="home-button">
          <i className="fas fa-home"></i> Trang chủ
        </Link>
      </div>
    </>
  );
};

export default Login;