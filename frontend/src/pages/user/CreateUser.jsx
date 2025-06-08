import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import userService from '../../services/UserService';
import './CreateUser.css';

const CreateUser = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    phone: '',
    role: '',
    email: '',
    isActive: '',
    password: ''
  });

  // Available roles
  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'NURSE', label: 'Nhân viên y tế' },
    { value: 'PARENT', label: 'Phụ huynh' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Create new user (register)
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const registerRequest = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role
      };

      await userService.createUser(registerRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Tạo người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
      resetForm();
    } catch (error) {
      setError('Failed to create user');
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      const token = localStorage.getItem('token');
      const updateRequest = {};
      if (userData.fullName) updateRequest.fullName = userData.fullName;
      if (userData.email) updateRequest.email = userData.email;
      if (userData.phone) updateRequest.phone = userData.phone;

      await userService.updateUser(id, updateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
      resetForm();
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      if (!currentUser.fullName || !currentUser.phone || !currentUser.email) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      updateUser(currentUser.id, currentUser);
    } else {
      if (!currentUser.fullName || !currentUser.phone || !currentUser.role || !currentUser.email || !currentUser.password) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      createUser(currentUser);
    }
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser({
      id: null,
      fullName: '',
      phone: '',
      role: '',
      email: '',
      isActive: '',
      password: ''
    });
  };

  return (
    <div className="create-user-page">
      <div className="create-user-header">
        <h1>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h1>
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
        <form onSubmit={handleSubmit} className="user-form">
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

          {!isEditing && (
            <div className="form-group">
              <label htmlFor="role">Vai trò</label>
              <select
                id="role"
                name="role"
                value={currentUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn vai trò</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isEditing && (
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={currentUser.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {isEditing && (
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
          )}

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="cancel-btn">
              <X size={16} />
              Hủy
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? (
                <>
                  <Save size={16} />
                  Cập nhật
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Thêm mới
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
