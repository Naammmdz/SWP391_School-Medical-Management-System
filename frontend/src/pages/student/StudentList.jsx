import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/StudentService';
import userService from '../../services/UserService';
import './StudentList.css';
import healthRecordService from '../../services/HealthRecordService';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch both students and users data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        params : { size: 1000 }, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch students
      const studentsResponse = await studentService.getAllStudents(config);
      setStudents(studentsResponse.data);

      // Fetch users to get parent information
      const usersResponse = await userService.getAllUsers(config);
      setUsers(usersResponse.data);
    } catch (error) {
      setError('Không thể tải dữ liệu học sinh');
    } finally {
      setLoading(false);
    }
  };

  // Get parent name from users list
  const getParentName = (parentId) => {
    const parent = users.find(user => user.id === parentId);
    return parent ? parent.fullName : 'Không xác định';
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Navigate to create new student
  const navigateToCreateStudent = () => {
    navigate('/taomoihocsinh');
  };

  // Navigate to update student
  const navigateToUpdateStudent = (studentId) => {
    navigate(`/capnhathocsinh/${studentId}`);
  };

  // Delete student
  const deleteStudent = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        const token = localStorage.getItem('token');
        await studentService.deleteStudent(studentId, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccessMessage('Xóa học sinh thành công!');
        setTimeout(() => setSuccessMessage(null), 2000);
        fetchData(); // Refresh the list
      } catch (error) {
        setError('Không thể xóa học sinh');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="student-list-page">
      <div className="student-list-header">
        <h1>Danh sách học sinh</h1>
        <button className="add-btn" onClick={navigateToCreateStudent}>
          <Plus size={16} />
          Thêm học sinh mới
        </button>
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

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Lớp</th>
                <th>Phụ huynh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.studentId}>
                  <td>{student.fullName}</td>
                  <td>{formatDate(student.dob)}</td>
                  <td>{student.gender === 'Male' ? 'Nam' : 'Nữ'}</td>
                  <td>{student.className}</td>
                  <td>{getParentName(student.parentId)}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigateToUpdateStudent(student.studentId)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteStudent(student.studentId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
