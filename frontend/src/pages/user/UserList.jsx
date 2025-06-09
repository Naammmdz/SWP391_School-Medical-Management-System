import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import './UserList.css';
import { Plus } from 'lucide-react';


const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Available roles for display
  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'NURSE', label: 'Nhân viên y tế' },
    { value: 'PARENT', label: 'Phụ huynh' }
  ];

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
      setSuccessMessage('Vô hiệu hóa người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError('Failed to disable user');
    }
  };

  // Navigate to update user
  const navigateToUpdateUser = (userId) => {
    navigate(`/capnhatnguoidung/${userId}`);
  };

  // Navigate to block user
  const navigateToBlockUser = (userId) => {
    navigate(`/khoanguoidung/${userId}`);
  };
  const navigateToCreateUser = () => {
    navigate('/taomoinguoidung');
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <h1>Danh sách người dùng</h1>
      </div>
      <button className="add-btn" onClick={navigateToCreateUser}>
              <Plus size={16} />
              Thêm mới
            </button>
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
                    onClick={() => navigateToUpdateUser(user.id)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => navigateToBlockUser(user.id)}
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
    </div>
  );
};

export default UserList;
