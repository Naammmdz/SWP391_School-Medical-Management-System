import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import './Admin.css';

const Admin = () => {
  // State for users list
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for form
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    phone: '',
    role: 'parent', // Default role
    email: '',
    password: ''
  });

  // Available roles
  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'nurse', label: 'Nhân viên y tế' },
    { value: 'parent', label: 'Phụ huynh' }
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await fetch('api/users');
      // const data = await response.json();
      
      // Mock data for now
      const mockUsers = [
        { id: 1, name: 'John Doe', phone: '0909090909', role: 'admin', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', phone: '0987654321', role: 'nurse', email: 'jane@example.com' },
        { id: 3, name: 'Bob Wilson', phone: '0123456789', role: 'parent', email: 'bob@example.com' }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setLoading(false);
    }
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
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      // API call would go here
      // const response = await fetch(`api/users/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();
      
      setUsers(users.map(user => 
        user.id === id ? { ...userData, id } : user
      ));
      resetForm();
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

  // Initialize component
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page">
      <h1>Quản lý người dùng</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* User form */}
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
        
        <div className="form-group">
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
        </div>
        
        <div className="form-actions">
          {isEditing && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              <X size={16} />
              Hủy
            </button>
          )}
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
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
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
    </div>
  );
};

export default Admin;
