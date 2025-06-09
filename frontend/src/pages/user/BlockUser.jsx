import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/UserService';
import './BlockUser.css';

const BlockUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const foundUser = response.data.find(u => u.id === parseInt(userId));
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('Không tìm thấy người dùng');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
    setLoading(false);
  };

  // Block user
  const blockUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await userService.deleteUser(userId, {
        params: { isActive: false },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Vô hiệu hóa người dùng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/danhsachnguoidung');
      }, 2000);
    } catch (error) {
      setError('Failed to block user');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return <div className="error-message">Không tìm thấy người dùng</div>;
  }

  return (
    <div className="block-user-page">
      <div className="block-user-header">
        <h1>Vô hiệu hóa người dùng</h1>
      </div>

      {successMessage && (
        <div className="success-message">
          <h2>{successMessage}</h2>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="user-info">
        <h2>Thông tin người dùng</h2>
        <div className="info-group">
          <label>Họ và tên:</label>
          <span>{user.fullName}</span>
        </div>
        <div className="info-group">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div className="info-group">
          <label>Số điện thoại:</label>
          <span>{user.phone}</span>
        </div>
        <div className="info-group">
          <label>Trạng thái hiện tại:</label>
          <span>
            {user.isActive === true || user.isActive === "true"
              ? "Đang hoạt động"
              : "Ngừng hoạt động"}
          </span>
        </div>
      </div>

      <div className="confirmation-section">
        <h3>Xác nhận vô hiệu hóa</h3>
        <p>Bạn có chắc chắn muốn vô hiệu hóa người dùng này?</p>
        <div className="action-buttons">
          <button onClick={() => navigate('/danhsachnguoidung')} className="cancel-btn">
            <X size={16} />
            Hủy
          </button>
          <button onClick={blockUser} className="confirm-btn">
            Xác nhận vô hiệu hóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUser;
