import React, { useState } from "react";
import "./Login.css";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { mockUsers } from "../../../data/mockUsers";

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const removeDiacritics = (str) => {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const handlePasswordChange = (e) => {
    // Chỉ cho phép chữ cái, số và các ký tự đặc biệt thông dụng cho mật khẩu
    const value = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    setPassword(value);
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      toast.error('Phone/Password is required!');
      return;
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = mockUsers.find(
        (u) => u.phone === phone && u.password === password
      );

      if (!user) {
        toast.error('Invalid credentials!');
        return;
      }

      // Store user info in localStorage
      const userData = {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      };

      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
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
      toast.error('Something went wrong.');
    }
  };

  return (
    <>
      <div className="login-container col-6">
        <div className="title">Đăng nhập</div>

        <div className="text">Số điện thoại</div>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="text">Mật khẩu</div>
        <div className="password-input">
          <input
            type={isShowPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={handlePasswordChange}
          />
          <span
            className="toggle-password"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? 'Hide' : 'Show'}
          </span>
        </div>

        <button
          className={phone && password ? 'active' : ''}
          disabled={!phone || !password}
          onClick={handleLogin}
        >
          Login
        </button>

        <div className="login-info">
          <p>Demo accounts:</p>
          <p>Admin - phone: admin, password: admin123</p>
          <p>Parent - phone: parent, password: parent123</p>
          <p>Nurse - phone: nurse, password: nurse123</p>
        </div>

        <Link to="/" className="home-button">
          <i className="fas fa-home"></i> Trang chủ
        </Link>
      </div>
    </>
  );
};

export default Login;
