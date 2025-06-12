import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import './UserList.css';
import studentService from '../../services/StudentService';

const roles = [
  { value: '', label: 'Vai trò' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'NURSE', label: 'Nhân viên y tế' },
  { value: 'PARENT', label: 'Phụ huynh' }
];

const sortOptions = [
  { value: 'fullName,asc', label: 'Tên (A-Z)' },
  { value: 'fullName,desc', label: 'Tên (Z-A)' },
  { value: 'role,asc', label: 'Vai trò (A-Z)' },
  { value: 'role,desc', label: 'Vai trò (Z-A)' }
];

const statusOptions = [
  { value: '', label: 'Trạng thái' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Ngừng hoạt động' }
];

const PAGE_SIZE = 10;

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filter states
  const [filter, setFilter] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    isActive: '',
    sort: 'fullName,asc'
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users from API with filters and pagination
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = {
        ...filter,
        page,
        size: PAGE_SIZE,
        sort: filter.sort
      };
      // Remove empty params
      Object.keys(params).forEach(
        (key) => (params[key] === '' || params[key] === undefined) && delete params[key]
      );
      // Convert isActive to boolean if needed
      if (params.isActive === 'true') params.isActive = true;
      if (params.isActive === 'false') params.isActive = false;

      const response = await userService.getAllUsers({
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Nếu backend trả về mảng, tự tính tổng trang
      setUsers(response.data);
      if (Array.isArray(response.data)) {
        setTotalPages(response.data.length < PAGE_SIZE ? page + 1 : page + 2); // Ước lượng, nên backend trả về tổng số trang
      } else if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
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
    navigate(`/admin/capnhatnguoidung/${userId}`);
  };

  // Navigate to block user
  const navigateToBlockUser = (userId) => {
    navigate(`/admin/khoanguoidung/${userId}`);
  };
  const navigateToCreateUser = () => {
    navigate('/admin/taomoinguoidung');
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset page when filter changes
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setFilter({
      fullName: '',
      email: '',
      phone: '',
      role: '',
      isActive: '',
      sort: 'fullName,asc'
    });
    setPage(0);
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, filter.sort]);

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <h1>Danh sách người dùng</h1>
      </div>
      <button className="add-btn" onClick={navigateToCreateUser}>
        <Plus size={16} />
        Thêm mới
      </button>
      
      {user.userRole === 'ROLE_PARENT' && (
        <button
          className="add-btn"
          style={{ marginLeft: 12, background: '#4caf50' }}
          onClick={() => navigate('/taomoihocsinh')}
        >
          <Plus size={16} />
          Thêm mới học sinh
        </button>
      )}
      {/* Filter Form */}
      <form className="user-filter-form" onSubmit={handleFilterSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={filter.fullName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={filter.email}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={filter.phone}
          onChange={handleFilterChange}
        />
        <select name="role" value={filter.role} onChange={handleFilterChange}>
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        <select name="isActive" value={filter.isActive} onChange={handleFilterChange}>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select name="sort" value={filter.sort} onChange={handleFilterChange}>
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button type="submit" className="filter-btn">Tìm kiếm</button>
        <button type="button" className="clear-btn" onClick={handleClearFilter}>Xóa lọc</button>
      </form>

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
    <th>Thao tác học sinh</th>
    <th>Hành động</th>
  </tr>
</thead>
        <tbody>
  {users.length === 0 ? (
    <tr>
      <td colSpan={7}>Không có người dùng nào.</td>
    </tr>
  ) : (
    users.map(userItem => (
      <tr key={userItem.id}>
        <td>{userItem.fullName}</td>
        <td>{userItem.phone}</td>
        <td>{userItem.email}</td>
        <td>
          {userItem.isActive === true || userItem.isActive === "true"
            ? "Đang hoạt động"
            : "Ngừng hoạt động"}
        </td>
        <td>
          {roles.find(role => role.value === userItem.role)?.label}
        </td>
        {/* Nếu userItem là PARENT thì hiển thị nút thêm học sinh */}
        <td>
  {(userItem.role === 'PARENT' || userItem.role === 'ROLE_PARENT') && (
    <button
      className="add-student-btn"
      onClick={() => navigate('/taomoihocsinh', { state: { parentId: userItem.id } })}
    >
      <Plus size={14} /> Thêm học sinh
    </button>
  )}
</td>
        <td className="actions">
          <button
            className="edit-btn"
            onClick={() => navigateToUpdateUser(userItem.id)}
          >
            <Edit size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={() => navigateToBlockUser(userItem.id)}
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          Trang sau
        </button>
      </div>

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