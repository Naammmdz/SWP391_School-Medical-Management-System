import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import './Admin.css';
import DashboardPage from '../dashboardPage/DashboardPage';
import userService from '../../services/UserService';

const Admin = () => {
  // State for users list
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for form
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    phone: '',
    role: '', // Default role
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

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  // Create new user (register)
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      // Chuẩn bị dữ liệu đúng định dạng backend yêu cầu
      const registerRequest = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role
      };

      // Gọi API đăng ký user mới
      await userService.createUser(registerRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchUsers();
      resetForm();
      setShowForm(false);
      setSuccessMessage('Tạo người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError('Failed to create user');
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      const token = localStorage.getItem('token');
      // Chỉ gửi các trường có giá trị
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

      await fetchUsers();
      resetForm();
      setShowForm(false);
      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Delete (vô hiệu hóa) user
  const deleteUser = async (id) => {
    setUserToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await userService.deleteUser(userToDelete, {
        params: { isActive: false },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(users.map(user =>
        user.id === userToDelete ? { ...user, isActive: false } : user
      ));
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (error) {
      setError('Failed to disable user');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate cho từng loại form
    if (isEditing) {
      // Update: chỉ cần fullName, phone, email (role không cho sửa, password không cần)
      if (!currentUser.fullName || !currentUser.phone || !currentUser.email) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      updateUser(currentUser.id, currentUser);
    } else {
      // Create: cần đủ các trường
      if (!currentUser.fullName || !currentUser.phone || !currentUser.role || !currentUser.email || !currentUser.password) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      createUser(currentUser);
    }
  };

  // Edit user
  const editUser = (user) => {
    setIsEditing(true);
    setCurrentUser({
      id: user.id,
      fullName: user.fullName || '',
      phone: user.phone || '',
      role: user.role || '',
      email: user.email || '',
      isActive: user.isActive,
      password: '' // Không cho sửa password khi update
    });
    setShowForm(true);
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

  // Show add form
  const showAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Initialize component
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý người dùng</h1>
        <button className="add-btn" onClick={showAddForm}>
          <Plus size={16} />
          Thêm mới
        </button>
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

      {/* User form */}
      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <div className="form-header">
              <h2>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
              <button className="close-btn" onClick={closeForm}>
                <X size={20} />
              </button>
            </div>

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

              {/* Chỉ cho chọn role khi tạo mới */}
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

              {/* Chỉ nhập password khi tạo mới */}
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

              {/* Hiển thị trạng thái khi chỉnh sửa */}
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
                <button type="button" onClick={closeForm} className="cancel-btn">
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
      )}

      {/* Users table */}
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  {user.isActive === true || user.isActive === "true"
                    ? "Đang hoạt động"
                    : "Ngừng hoạt động"}
                </td>
                <td>
                  {roles.find(role => role.value === user.role)?.label}
                </td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => editUser(user)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác nhận vô hiệu hóa</h3>
              <button className="close-modal" onClick={() => setShowConfirmModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn vô hiệu hóa người dùng này?</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>
                Hủy
              </button>
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardPage />
    </div>
  );
};

export default Admin;