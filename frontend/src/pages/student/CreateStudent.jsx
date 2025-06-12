import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import userService from '../../services/UserService';
import studentService from '../../services/StudentService';
import { useLocation } from 'react-router-dom';
import './CreateStudent.css';

const CreateStudent = () => {
  const location = useLocation();
  const parentId = location.state?.parentId || '';
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    yob: '',
    gender: '',
    className: ''
  });

  // Lấy thông tin phụ huynh từ parentId
  useEffect(() => {
    const fetchParent = async () => {
      if (!parentId) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await userService.getUserById(parentId, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParent(res.data);
      } catch (err) {
        setError('Không tìm thấy thông tin phụ huynh!');
      }
      setLoading(false);
    };
    fetchParent();
  }, [parentId]);

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };

  // Tạo mới học sinh
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!parentId) {
      setError('Không xác định được phụ huynh!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const createRequest = {
        ...studentForm,
        parentId
      };
      await studentService.createStudent(createRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessMessage('Tạo học sinh thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
      setStudentForm({
        fullName: '',
        yob: '',
        gender: '',
        className: ''
      });
    } catch (err) {
      setError('Tạo học sinh thất bại!');
    }
  };

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
            <input
              type="text"
              value={parent ? parent.fullName : ''}
              disabled
              readOnly
              style={{ background: '#f5f5f5' }}
            />
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