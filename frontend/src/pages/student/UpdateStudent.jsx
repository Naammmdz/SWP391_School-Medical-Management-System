import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import studentService from '../../services/StudentService';
import userService from '../../services/UserService';
import './UpdateStudent.css';

const UpdateStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [student, setStudent] = useState({
    fullName: '',
    dob: '',
    gender: '',
    className: '',
    parentId: null
  });
  const [parentName, setParentName] = useState('');

  // Fetch student data
  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await studentService.getAllStudents(config);
      const studentData = response.data.find(s => s.studentId === parseInt(studentId));
      
      if (studentData) {
        // Format date from YYYY-MM-DD to YYYY-MM-DD for input
        const formattedDate = new Date(studentData.dob).toISOString().split('T')[0];
        setStudent({
          ...studentData,
          dob: formattedDate
        });

        // Fetch parent name
        const usersResponse = await userService.getAllUsers(config);
        const parent = usersResponse.data.find(u => u.id === studentData.parentId);
        setParentName(parent ? parent.fullName : 'Không xác định');
      } else {
        setError('Không tìm thấy thông tin học sinh');
      }
    } catch (error) {
      setError('Không thể tải thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Prepare update data
      const updateData = {
        fullName: student.fullName,
        dob: student.dob,
        gender: student.gender,
        className: student.className
      };

      await studentService.updateStudent(studentId, updateData, config);
      setSuccessMessage('Cập nhật thông tin học sinh thành công!');
      setTimeout(() => {
        navigate('/danhsachhocsinh');
      }, 2000);
    } catch (error) {
      setError('Không thể cập nhật thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !student.fullName) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="update-student-page">
      <div className="update-student-header">
        <h1>Cập nhật thông tin học sinh</h1>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={student.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Ngày sinh</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={student.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Giới tính</label>
          <select
            id="gender"
            name="gender"
            value={student.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="className">Lớp</label>
          <input
            type="text"
            id="className"
            name="className"
            value={student.className}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phụ huynh</label>
          <input
            type="text"
            value={parentName}
            disabled
            className="disabled-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/danhsachhocsinh')}
          >
            <X size={16} />
            Hủy
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            <Save size={16} />
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;
