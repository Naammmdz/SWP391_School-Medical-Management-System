import { useState } from 'react';
import './Login.css';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      toast.error('Phone/Password is required!');
      return;
    }

   
    try {
     
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = {
        token: 'fake-jwt-token',
        user: {
          phone,
          name: 'John Doe',
        },
      };

      toast.success('Login successful!');
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <>
      <div className="login-container col-6">
        <div className="title">Login</div>

        <div className="text">Phone or username</div>
        <input
          type="text"
          placeholder="Enter phone or username"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="text">Password</div>
        <div className="password-input">
          <input
            type={isShowPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <li><Link to="/">Quay lại trang chủ</Link></li>
      </div>
    </>
  );
};

export default Login;
