import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import userService from '../../services/UserService';
import studentService from '../../services/StudentService';
import './CreateStudent.css';

const CreateStudent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    yob: '',
    gender: '',
    className: '',
    parentId: ''
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        params: {size:1000},
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

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };

  // Create new student
  const createStudent = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      // Find parentId from users list (role is PARENT)
      const parentUser = users.find(u => u.role === 'PARENT' && u.email === userData.parentEmail);
      if (!parentUser) {
        setError('Không tìm thấy phụ huynh phù hợp!');
        return;
      }
      const createRequest = {
        fullName: userData.fullName,
        yob: userData.yob,
        gender: userData.gender,
        className: userData.className,
        parentId: parentUser.id
      };

      await studentService.createStudent(createRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchUsers();
      setSuccessMessage('Tạo học sinh thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
      // Reset form after successful creation
      setStudentForm({
        fullName: '',
        yob: '',
        gender: '',
        className: '',
        parentId: ''
      });
    } catch (err) {
      setError('Tạo học sinh thất bại!');
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    // Find parent by id
    const parentUser = users.find(u => u.role === 'PARENT' && String(u.id) === String(studentForm.parentId));
    if (!parentUser) {
      setError('Vui lòng chọn phụ huynh hợp lệ!');
      return;
    }
    await createStudent({
      ...studentForm,
      parentEmail: parentUser.email
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="create-student-page">
      <div className="create-student-header">
        <h1>Tạo mới học sinh</h1>
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
        <form onSubmit={handleStudentSubmit} className="student-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={studentForm.fullName}
              onChange={handleStudentInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="yob"
              value={studentForm.yob}
              onChange={handleStudentInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gender"
              value={studentForm.gender}
              onChange={handleStudentInputChange}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lớp</label>
            <input
              type="text"
              name="className"
              value={studentForm.className}
              onChange={handleStudentInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phụ huynh</label>
            <select
              name="parentId"
              value={studentForm.parentId}
              onChange={handleStudentInputChange}
              required
            >
              <option value="">Chọn phụ huynh</option>
              {users
                .filter(u => u.role === 'PARENT')
                .map(parent => (
                  <option key={parent.id} value={parent.id}>
                    {parent.fullName}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              <Plus size={16} /> Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
