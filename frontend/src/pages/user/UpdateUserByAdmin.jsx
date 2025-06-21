import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/UserService';
import './UpdateUserByAdmin.css';

const UpdateUserByAdmin = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    phone: '',
    email: '',
    isActive: ''
  });

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = response.data.find(u => u.id === parseInt(userId));
      if (user) {
        setCurrentUser({
          id: user.id,
          fullName: user.fullName || '',
          phone: user.phone || '',
          email: user.email || '',
          isActive: user.isActive
        });
      } else {
        setError('Không tìm thấy người dùng');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updateRequest = {};
      if (currentUser.fullName) updateRequest.fullName = currentUser.fullName;
      if (currentUser.email) updateRequest.email = currentUser.email;
      if (currentUser.phone) updateRequest.phone = currentUser.phone;

      await userService.updateUser(currentUser.id, updateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/admin/danhsachnguoidung');
      }, 2000);
    } catch (error) {
      setError('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div className="update-user-page">
      <div className="update-user-header">
        <h1>Chỉnh sửa thông tin người dùng</h1>
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

      <div className="form-container">
        <form onSubmit={updateUser} className="user-form">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={currentUser.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={currentUser.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isActive">Trạng thái</label>
            <input
              type="text"
              id="isActive"
              name="isActive"
              value={
                currentUser.isActive === true || currentUser.isActive === "true"
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"
              }
              disabled
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/danhsachnguoidung')} className="cancel-btn">
              <X size={16} />
              Hủy
            </button>
            <button type="submit" className="submit-btn">
              <Save size={16} />
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserByAdmin;
