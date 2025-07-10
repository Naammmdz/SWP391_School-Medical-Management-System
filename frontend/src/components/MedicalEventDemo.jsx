import React, { useState, useEffect } from 'react';
import StudentSelectionModal from './StudentSelectionModal';
import studentService from '../services/StudentService';
import MedicalEventService from '../services/MedicalEventService';
import './MedicalEventDemo.css';

const MedicalEventDemo = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSelectionModalOpen, setStudentSelectionModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    stuId: [],
    eventType: '',
    eventDate: new Date().toISOString().slice(0, 16),
    location: '',
    description: '',
    severityLevel: 'MINOR',
    handlingMeasures: '',
    notes: '',
    status: 'PROCESSING'
  });

  // Load available classes when component mounts
  useEffect(() => {
    fetchAvailableClasses();
  }, []);

  const fetchAvailableClasses = async () => {
    try {
      const response = await studentService.getDistinctClassNames();
      if (response.data && Array.isArray(response.data)) {
        const classOptions = response.data.map(className => ({
          id: className,
          name: className
        }));
        setAvailableClasses(classOptions);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Không thể lấy danh sách lớp. Vui lòng thử lại.');
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleOpenStudentModal = () => {
    if (selectedClass) {
      setStudentSelectionModalOpen(true);
    }
  };

  const handleCloseStudentModal = () => {
    setStudentSelectionModalOpen(false);
  };

  const handleConfirmStudentSelection = (selectedIds, selectedStudentObjects) => {
    setCurrentEvent({...currentEvent, stuId: selectedIds});
    setSelectedStudents(selectedStudentObjects);
    setStudentSelectionModalOpen(false);
  };

  const handleRemoveStudent = (studentId) => {
    const updatedStudentIds = currentEvent.stuId.filter(id => id !== studentId);
    setCurrentEvent({...currentEvent, stuId: updatedStudentIds});
    const updatedSelectedStudents = selectedStudents.filter(s => s.studentId !== studentId);
    setSelectedStudents(updatedSelectedStudents);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({...currentEvent, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentEvent.title || !currentEvent.eventType || !currentEvent.eventDate || currentEvent.stuId.length === 0) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc và chọn ít nhất một học sinh');
      return;
    }

    setLoading(true);
    try {
      const response = await MedicalEventService.createMedicalEvent(currentEvent);
      alert('Tạo sự cố y tế thành công!');
      
      // Reset form
      setCurrentEvent({
        title: '',
        stuId: [],
        eventType: '',
        eventDate: new Date().toISOString().slice(0, 16),
        location: '',
        description: '',
        severityLevel: 'MINOR',
        handlingMeasures: '',
        notes: '',
        status: 'IN_PROGRESS'
      });
      setSelectedStudents([]);
      setSelectedClass('');
      
    } catch (error) {
      console.error('Error creating medical event:', error);
      alert('Có lỗi xảy ra khi tạo sự cố y tế. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-event-demo">
      <h2>Tạo Sự Cố Y Tế Mới</h2>
      
      <form onSubmit={handleSubmit} className="medical-event-form">
        <div className="form-section">
          <h3>Thông Tin Cơ Bản</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Tiêu đề sự cố <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                id="title"
                value={currentEvent.title}
                onChange={handleInputChange}
                required
                placeholder="Nhập tiêu đề sự cố"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="eventType">Loại sự cố <span className="required">*</span></label>
              <input
                type="text"
                name="eventType"
                id="eventType"
                value={currentEvent.eventType}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: Chấn thương, Bệnh tật, Dị ứng"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Ngày và giờ xảy ra <span className="required">*</span></label>
              <input
                type="datetime-local"
                name="eventDate"
                id="eventDate"
                value={currentEvent.eventDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Địa điểm</label>
              <input
                type="text"
                name="location"
                id="location"
                value={currentEvent.location}
                onChange={handleInputChange}
                placeholder="Ví dụ: Lớp học, Sân chơi, Nhà ăn"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Chọn Học Sinh Liên Quan</h3>
          
          <div className="class-selection-section">
            <div className="class-selection-row">
              <label htmlFor="classSelect">Chọn lớp để hiển thị học sinh:</label>
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
            
            {selectedClass && (
              <div className="class-actions">
                <button 
                  type="button" 
                  onClick={handleOpenStudentModal}
                  className="open-student-modal-btn"
                >
                  Chọn học sinh từ lớp {selectedClass}
                </button>
              </div>
            )}
          </div>

          {currentEvent.stuId.length > 0 && (
            <div className="selected-students-summary">
              <strong>Đã chọn {currentEvent.stuId.length} học sinh:</strong>
              <div className="selected-students-list">
                {selectedStudents.map(student => (
                  <span key={student.studentId} className="selected-student-tag">
                    {student.fullName} (ID: {student.studentId})
                    <button 
                      type="button" 
                      onClick={() => handleRemoveStudent(student.studentId)}
                      className="remove-student-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Chi Tiết Sự Cố</h3>
          
          <div className="form-group">
            <label htmlFor="description">Mô tả chi tiết</label>
            <textarea
              name="description"
              id="description"
              value={currentEvent.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Mô tả chi tiết về sự cố..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severityLevel">Mức độ nghiêm trọng</label>
              <select
                name="severityLevel"
                id="severityLevel"
                value={currentEvent.severityLevel}
                onChange={handleInputChange}
              >
                <option value="MINOR">Nhẹ</option>
                <option value="MODERATE">Trung bình</option>
                <option value="MAJOR">Nặng</option>
                <option value="CRITICAL">Cấp cứu</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="handlingMeasures">Biện pháp xử lý</label>
              <textarea
                name="handlingMeasures"
                id="handlingMeasures"
                value={currentEvent.handlingMeasures}
                onChange={handleInputChange}
                rows="3"
                placeholder="Mô tả các biện pháp xử lý đã thực hiện..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Ghi chú</label>
            <textarea
              name="notes"
              id="notes"
              value={currentEvent.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Ghi chú thêm..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo sự cố y tế'}
          </button>
        </div>
      </form>

      {/* Student Selection Modal */}
      <StudentSelectionModal
        isOpen={studentSelectionModalOpen}
        onClose={handleCloseStudentModal}
        onConfirm={handleConfirmStudentSelection}
        selectedStudentIds={currentEvent.stuId}
        availableClasses={availableClasses}
      />
    </div>
  );
};

export default MedicalEventDemo;
