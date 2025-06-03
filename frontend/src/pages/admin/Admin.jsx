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

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Gửi request getAllUsers với token:', token);
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  

  // Create new user
  const createUser = async (userData) => {
    try {
      // API call would go here
      // const response = await fetch('api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();
      
      // Mock response
      const newUser = {
        ...userData,
        id: users.length + 1
      };
      
      setUsers([...users, newUser]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
  try {
    const token = localStorage.getItem('token');
    // Chuyển đổi dữ liệu cho đúng với UserUpdateRequest
    const updateRequest = {
      fullName: userData.name,   // name trên form -> fullName cho backend
      email: userData.email,
      phone: userData.phone
    };
    await userService.updateUser(id, updateRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Cập nhật lại danh sách users trên UI (nên fetch lại từ backend để đồng bộ)
    setUsers(users.map(user =>
      user.id === id ? { ...user, ...updateRequest, id } : user
    ));
    resetForm();
    setShowForm(false);
  } catch (error) {
    console.error('Error updating user:', error);
    setError('Failed to update user');
  }
};
  // Delete user
  const deleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        // API call would go here
        // await fetch(`api/users/${id}`, {
        //   method: 'DELETE'
        // });
        
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
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
    
    if (!currentUser.name || !currentUser.phone || !currentUser.role || !currentUser.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (isEditing) {
      updateUser(currentUser.id, currentUser);
    } else {
      createUser(currentUser);
    }
  };

  // Edit user
  const editUser = (user) => {
    setIsEditing(true);
    setCurrentUser({ ...user });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser({
      id: null,
      name: '',
      phone: '',
      role: 'parent',
      email: '',
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
                <label htmlFor="name">Tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentUser.name}
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
                  type="isActive"
                  id="isActive"
                  name="isActive"
                  value={currentUser.isActive}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
              
              {/* <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  required
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div> */}
              
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
              <th>Tên</th>
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
                  {/* Hiển thị trạng thái true/false thành chữ */}
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
      <DashboardPage/>
    </div>
  );
};

export default Admin;
