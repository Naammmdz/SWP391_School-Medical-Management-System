import React, { useState, useEffect } from 'react';
import './MedicalEvents.css';
import MedicalEventService from '../../../services/MedicalEventService';

// Lựa chọn cho loại sự cố


// Lựa chọn cho biện pháp xử lý
const handlingMethods = [
  { value: 'Sơ cứu', label: 'Sơ cứu' },
  { value: 'Băng bó', label: 'Băng bó' },
  { value: 'Thuốc', label: 'Cho uống thuốc' },
  { value: 'Nghỉ ngơi', label: 'Cho nghỉ ngơi' },
  { value: 'Liên hệ phụ huynh', label: 'Liên hệ phụ huynh' },
  { value: 'Chuyển viện', label: 'Chuyển viện' },
  { value: 'Khác', label: 'Khác' }
];

// 1. Add severity and status options
const severityOptions = [
  { value: 'MINOR', label: 'Nhẹ' },
  { value: 'MODERATE', label: 'Trung bình' },
  { value: 'SERIOUS', label: 'Nặng' },
  { value: 'CRITICAL', label: 'Cấp cứu' },
];
const statusOptions = [
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã xử lý' },
];

const MedicalEvents = () => {
  // State cho danh sách sự cố y tế
  const [medicalEvents, setMedicalEvents] = useState([]);
  // State cho form thêm/sửa sự cố
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: '',
    eventType: '',
    eventDate: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    relatedMedicinesUsed: '',
    notes: '',
    handlingMeasures: '',
    severityLevel: 'MINOR',
    status: 'PROCESSING',
    stuId: '',
    studentName: '', // for display only
    studentClass: '', // for display only
  });
  // State cho chế độ chỉnh sửa
  const [editing, setEditing] = useState(false);
  // State cho hiển thị modal
  const [modalOpen, setModalOpen] = useState(false);
  // State cho loading
  const [loading, setLoading] = useState(false);
  // State cho lọc và tìm kiếm
  const [filters, setFilters] = useState({
    searchTerm: '',
    incidentType: '',
    fromDate: '',
    toDate: '',
    status: ''
  });

  // 2. Add state for students and selected student
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Hàm gọi API để lấy danh sách sự cố y tế
  const fetchMedicalEvents = async () => {
    setLoading(true);
    try {
      // Use service to get data
      const data = await MedicalEventService.getMedicalEvents();
      setMedicalEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical events:', error);
      setLoading(false);
      
      // Fallback to mock data if API fails
      const mockData = [
        {
          id: 1,
          title: 'Trượt chân',
          incidentType: 'Ngã',
          date: '2020-10-07',
          handlingMethod: 'Sơ ý',
          description: 'Học sinh trượt chân tại cầu thang',
          studentName: 'Nguyễn Văn A',
          studentClass: '10A1',
          location: 'Cầu thang tầng 2',
          status: 'Đã xử lý',
          severity: 'Nhẹ'
        },
        {
          id: 2,
          title: 'Sốt cao',
          incidentType: 'Sốt',
          date: '2020-10-10',
          handlingMethod: 'Cho uống thuốc và liên hệ phụ huynh',
          description: 'Học sinh sốt 38.5 độ trong giờ học',
          studentName: 'Trần Thị B',
          studentClass: '11A2',
          location: 'Phòng học 11A2',
          status: 'Đã xử lý',
          severity: 'Trung bình'
        }
      ];
      setMedicalEvents(mockData);
    }
  };

      // Hàm thêm sự cố y tế mới  const addMedicalEvent = async (event) => {    setLoading(true);    try {      // Use service to add new event      const newEvent = await MedicalEventService.createMedicalEvent(event);            setMedicalEvents([...medicalEvents, newEvent]);      setModalOpen(false);      setCurrentEvent({        id: null,        title: '',        incidentType: '',        date: new Date().toISOString().split('T')[0],        handlingMethod: '',        description: '',        studentName: '',        studentClass: '',        location: '',        status: 'Đang xử lý',        severity: 'Nhẹ'      });      setLoading(false);    } catch (error) {      console.error('Error adding medical event:', error);      setLoading(false);            // Fallback if API fails      const newEvent = {        ...event,        id: medicalEvents.length + 1,        date: event.date      };            setMedicalEvents([...medicalEvents, newEvent]);      setModalOpen(false);    }  };

  // Hàm cập nhật sự cố y tế
  const updateMedicalEvent = async (id, updatedEvent) => {
    setLoading(true);
    try {
      // Giả lập API call
      // const response = await fetch(`api/medical-events/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedEvent)
      // });
      // const data = await response.json();
      
      setMedicalEvents(medicalEvents.map(event => 
        event.id === id ? {...updatedEvent, id} : event
      ));
      setEditing(false);
      setModalOpen(false);
      setCurrentEvent({
        id: null,
        title: '',
        incidentType: '',
        date: new Date().toISOString().split('T')[0],
        handlingMethod: '',
        description: '',
        studentName: '',
        studentClass: '',
        location: '',
        status: 'Đang xử lý',
        severity: 'Nhẹ'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error updating medical event:', error);
      setLoading(false);
    }
  };

  // Hàm xóa sự cố y tế
  const deleteMedicalEvent = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sự cố y tế này?')) {
      setLoading(true);
      try {
        // Giả lập API call
        // await fetch(`api/medical-events/${id}`, {
        //   method: 'DELETE'
        // });
        
        setMedicalEvents(medicalEvents.filter(event => event.id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error deleting medical event:', error);
        setLoading(false);
      }
    }
  };

  // Hàm mở form chỉnh sửa
  const editMedicalEvent = (event) => {
    setEditing(true);
    setCurrentEvent({...event});
    setModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentEvent.title || !currentEvent.eventType || !currentEvent.eventDate || !currentEvent.stuId) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    const eventData = {
      title: currentEvent.title,
      stuId: currentEvent.stuId,
      eventType: currentEvent.eventType,
      eventDate: currentEvent.eventDate,
      location: currentEvent.location,
      description: currentEvent.description,
      relatedMedicinesUsed: currentEvent.relatedMedicinesUsed,
      notes: currentEvent.notes,
      handlingMeasures: currentEvent.handlingMeasures,
      severityLevel: currentEvent.severityLevel,
      status: currentEvent.status,
    };
    if (editing) {
      updateMedicalEvent(currentEvent.id, eventData);
    } else {
      addMedicalEvent(eventData);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({...filters, [name]: value});
  };

  // Lọc danh sách sự cố y tế
  const filteredEvents = medicalEvents.filter(event => {
    return (
      (filters.searchTerm === '' || 
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.incidentType === '' || event.incidentType === filters.incidentType) &&
      (filters.status === '' || event.status === filters.status) &&
      (filters.fromDate === '' || new Date(event.date) >= new Date(filters.fromDate)) &&
      (filters.toDate === '' || new Date(event.date) <= new Date(filters.toDate))
    );
  });

  // Lấy danh sách khi component mount
  useEffect(() => {
    fetchMedicalEvents();
  }, []);

  // 4. Load students from localStorage on mount
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);
  }, []);

  // 5. Handle student selection
  const handleStudentChange = (e) => {
    const stuId = e.target.value;
    const student = students.find(s => String(s.studentId) === String(stuId));
    setSelectedStudent(student);
    setCurrentEvent(prev => ({
      ...prev,
      stuId: student ? student.studentId : '',
      studentName: student ? student.fullName : '',
      studentClass: student ? student.className : '',
    }));
  };

  // 8. Update addMedicalEvent to use correct API and data
  const addMedicalEvent = async (event) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await MedicalEventService.createMedicalEvent(event, config);
      fetchMedicalEvents();
      setModalOpen(false);
      setCurrentEvent({
        id: null,
        title: '',
        eventType: '',
        eventDate: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        relatedMedicinesUsed: '',
        notes: '',
        handlingMeasures: '',
        severityLevel: 'MINOR',
        status: 'PROCESSING',
        stuId: '',
        studentName: '',
        studentClass: '',
      });
      setSelectedStudent(null);
      setLoading(false);
    } catch (error) {
      console.error('Error adding medical event:', error);
      setLoading(false);
    }
  };

  return (
    <div className="medical-events-page">
      <h1 className="page-title">Quản lý sự cố y tế</h1>
      
      {/* Bộ lọc */}
      <div className="filters-container">
        <div className="search-box">
          <input 
            type="text"
            name="searchTerm"
            placeholder="Tìm kiếm theo tiêu đề hoặc tên học sinh"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-options">
        
          
          <select 
            name="status" 
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
          </select>
          
          <input 
            type="date" 
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            placeholder="Từ ngày"
          />
          
          <input 
            type="date" 
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            placeholder="Đến ngày"
          />
        </div>
      </div>

      {/* Nút thêm sự cố mới */}
      <button 
        className="add-event-btn"
        onClick={() => {
          setEditing(false);
          setCurrentEvent({
            id: null,
            title: '',
            eventType: '',
            eventDate: new Date().toISOString().split('T')[0],
            location: '',
            description: '',
            relatedMedicinesUsed: '',
            notes: '',
            handlingMeasures: '',
            severityLevel: 'MINOR',
            status: 'PROCESSING',
            stuId: '',
            studentName: '',
            studentClass: '',
          });
          setModalOpen(true);
        }}
      >
        Thêm sự cố y tế
      </button>

      {/* Bảng danh sách sự cố */}
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại sự cố</th>
              <th>Học sinh</th>
              <th>Lớp</th>
              <th>Ngày xảy ra</th>
              <th>Biện pháp xử lý</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.incidentType}</td>
                  <td>{event.studentName}</td>
                  <td>{event.studentClass}</td>
                  <td>{new Date(event.date).toLocaleDateString('vi-VN')}</td>
                  <td>{event.handlingMethod}</td>
                  <td>
                    <span className={`status ${event.status === 'Đang xử lý' ? 'pending' : 'resolved'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => editMedicalEvent(event)}>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => deleteMedicalEvent(event.id)}>
                      Xóa
                    </button>
                    <button className="view-btn" onClick={() => {
                      setCurrentEvent({...event});
                      // Hiển thị chi tiết (có thể thêm modal riêng cho xem chi tiết)
                    }}>
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">Không có dữ liệu sự cố y tế</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal thêm/sửa sự cố y tế */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>{editing ? 'Sửa sự cố y tế' : 'Thêm sự cố y tế mới'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stuId">Học sinh <span className="required">*</span></label>
                  <select
                    name="stuId"
                    id="stuId"
                    value={currentEvent.stuId}
                    onChange={handleStudentChange}
                    required
                  >
                    <option value="">-- Chọn học sinh --</option>
                    {students.map(student => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.fullName} - {student.className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="eventDate">Ngày xảy ra <span className="required">*</span></label>
                  <input
                    type="date"
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
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="handlingMeasures">Biện pháp xử lý</label>
                  <select
                    name="handlingMeasures"
                    id="handlingMeasures"
                    value={currentEvent.handlingMeasures}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn biện pháp xử lý --</option>
                    {handlingMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="severityLevel">Mức độ nghiêm trọng</label>
                  <select
                    name="severityLevel"
                    id="severityLevel"
                    value={currentEvent.severityLevel}
                    onChange={handleInputChange}
                  >
                    {severityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    name="status"
                    id="status"
                    value={currentEvent.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="relatedMedicinesUsed">Thuốc/supplies đã dùng</label>
                  <input
                    type="text"
                    name="relatedMedicinesUsed"
                    id="relatedMedicinesUsed"
                    value={currentEvent.relatedMedicinesUsed}
                    onChange={handleInputChange}
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
                  rows="2"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="description">Mô tả chi tiết</label>
                <textarea
                  name="description"
                  id="description"
                  value={currentEvent.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {editing ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalEvents;
