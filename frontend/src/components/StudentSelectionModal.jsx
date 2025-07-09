import React, { useState, useEffect } from 'react';
import studentService from '../services/StudentService';
import './StudentSelectionModal.css';

const StudentSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedStudentIds = [], 
  availableClasses = [] 
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds([...selectedStudentIds]);
    }
  }, [isOpen, selectedStudentIds]);

  const fetchStudentsInClass = async (className) => {
    if (!className) return;
    
    setLoading(true);
    try {
      const response = await studentService.getStudentsByClassName(className);
      if (response.data && Array.isArray(response.data)) {
        setStudentsInClass(response.data);
      } else {
        setStudentsInClass([]);
      }
    } catch (error) {
      console.error('Error fetching students in class:', error);
      setStudentsInClass([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    if (className) {
      fetchStudentsInClass(className);
    } else {
      setStudentsInClass([]);
    }
  };

  const handleStudentToggle = (studentId) => {
    if (tempSelectedIds.includes(studentId)) {
      setTempSelectedIds(tempSelectedIds.filter(id => id !== studentId));
    } else {
      setTempSelectedIds([...tempSelectedIds, studentId]);
    }
  };

  const handleConfirm = () => {
    const selectedStudents = studentsInClass.filter(student => 
      tempSelectedIds.includes(student.studentId)
    );
    onConfirm(tempSelectedIds, selectedStudents);
    handleClose();
  };

  const handleClose = () => {
    setSelectedClass('');
    setStudentsInClass([]);
    setTempSelectedIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content student-selection-modal">
        <div className="modal-header">
          <h2>Chọn học sinh</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="class-selection-section">
            <label htmlFor="classSelect">Chọn lớp:</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={handleClassChange}
              className="class-dropdown"
            >
              <option value="">-- Chọn lớp --</option>
              {availableClasses.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="loading-message">Đang tải danh sách học sinh...</div>
          )}

          {selectedClass && !loading && (
            <div className="students-section">
              <h3>Học sinh trong lớp {selectedClass}:</h3>
              <div className="students-in-class">
                {studentsInClass.length > 0 ? (
                  studentsInClass.map(student => (
                    <div key={student.studentId} className="student-checkbox-item">
                      <input
                        type="checkbox"
                        id={`modal-student-${student.studentId}`}
                        checked={tempSelectedIds.includes(student.studentId)}
                        onChange={() => handleStudentToggle(student.studentId)}
                      />
                      <label htmlFor={`modal-student-${student.studentId}`} className="student-checkbox-label">
                        <span className="student-name">{student.fullName}</span>
                        <span className="student-details">
                          (ID: {student.studentId}, Ngày sinh: {student.dob}, Giới tính: {student.gender})
                        </span>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="no-students-message">Không có học sinh nào trong lớp này.</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleClose}
          >
            Hủy
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleConfirm}
            disabled={tempSelectedIds.length === 0}
          >
            Xác nhận ({tempSelectedIds.length} học sinh)
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectionModal;
