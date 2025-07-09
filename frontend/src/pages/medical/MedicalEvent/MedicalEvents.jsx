import React, { useState, useEffect } from 'react';
import './MedicalEvents.css';
import MedicalEventService from '../../../services/MedicalEventService';
import studentService from '../../../services/StudentService';

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

const MedicalEvents = () => {
  // State cho danh sách sự cố y tế
  const [medicalEvents, setMedicalEvents] = useState([]);
  // State cho thông tin học sinh
  const [studentsInfo, setStudentsInfo] = useState({});
  // State cho form thêm/sửa sự cố
  const [currentEvent, setCurrentEvent] = useState({
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

  // Hàm lấy thông tin học sinh theo ID
  const fetchStudentInfo = async (studentId) => {
    try {
      const response = await studentService.getStudentById(studentId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      return null;
    }
  };

  // Hàm gọi API để lấy danh sách sự cố y tế
  const fetchMedicalEvents = async () => {
    setLoading(true);
    try {
      const response = await MedicalEventService.getAllMedicalEvents();
      console.log('API Response:', response.data); // Debug log
      
      if (response.data && Array.isArray(response.data)) {
        setMedicalEvents(response.data);
        
        // Lấy thông tin học sinh cho tất cả các sự cố
        const studentIds = new Set();
        response.data.forEach(event => {
          if (event.stuId && Array.isArray(event.stuId)) {
            event.stuId.forEach(id => studentIds.add(id));
          }
        });
        
        // Fetch thông tin học sinh
        const studentsData = {};
        for (const studentId of studentIds) {
          const studentInfo = await fetchStudentInfo(studentId);
          if (studentInfo) {
            studentsData[studentId] = studentInfo;
          }
        }
        setStudentsInfo(studentsData);
      } else {
        console.warn('API response is not an array:', response.data);
        setMedicalEvents([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medical events:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        // Redirect to login page
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Access denied. You need NURSE role to access medical events.');
      } else {
        alert('Failed to fetch medical events. Please try again.');
      }
      
      setMedicalEvents([]);
      setLoading(false);
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

  // Hàm xem chi tiết sự cố y tế
  const viewMedicalEventDetails = (event) => {
    setCurrentEvent({...event});
    setEditing(false);
    setModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentEvent.title || !currentEvent.incidentType || !currentEvent.date) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (editing) {
      updateMedicalEvent(currentEvent.id, currentEvent);
    } else {
      addMedicalEvent(currentEvent);
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({...currentEvent, [name]: value});
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
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Học sinh</th>
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
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>
                    {event.stuId && event.stuId.length > 0 ? (
                      <div>
                        {event.stuId.map(studentId => {
                          const studentInfo = studentsInfo[studentId];
                          return (
                            <div key={studentId} className="student-info">
                              {studentInfo ? (
                                <span>
                                  <strong>{studentInfo.fullName}</strong>
                                  <br />
                                  <small>ID: {studentId} | Class: {studentInfo.className}</small>
                                </span>
                              ) : (
                                <span>Loading student {studentId}...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span>No student assigned</span>
                    )}
                  </td>
                  <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                  <td>{event.handlingMeasures || 'N/A'}</td>
                  <td>
                    <span className={`status ${event.status === 'IN_PROGRESS' ? 'pending' : 'resolved'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="view-btn" onClick={() => viewMedicalEventDetails(event)} title="View Details">
                      <span className="btn-icon">👁️</span>
                      View Details
                    </button>
                    <button className="edit-btn" onClick={() => editMedicalEvent(event)} title="Edit">
                      <span className="btn-icon">✏️</span>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteMedicalEvent(event.id)} title="Delete">
                      <span className="btn-icon">🗑️</span>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">Không có dữ liệu sự cố y tế</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal thêm/sửa/xem chi tiết sự cố y tế */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>
              {!editing && currentEvent.id ? 'Chi tiết sự cố y tế' : 
               editing ? 'Sửa sự cố y tế' : 'Thêm sự cố y tế mới'}
            </h2>
            
            {/* View Details Mode */}
            {!editing && currentEvent.id && (
              <div className="event-details">
                <div className="event-details-left">
                  <div className="detail-row">
                    <strong>ID:</strong> {currentEvent.id}
                  </div>
                  <div className="detail-row">
                    <strong>Tiêu đề:</strong> {currentEvent.title}
                  </div>
                  <div className="detail-row">
                    <strong>Loại sự cố:</strong> {currentEvent.eventType}
                  </div>
                  <div className="detail-row">
                    <strong>Ngày xảy ra:</strong> {currentEvent.eventDate ? new Date(currentEvent.eventDate).toLocaleString('vi-VN') : 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Địa điểm:</strong> {currentEvent.location || 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Mức độ nghiêm trọng:</strong> {currentEvent.severityLevel || 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Trạng thái:</strong> {currentEvent.status || 'N/A'}
                  </div>
                </div>
                
                <div className="event-details-right">
                  <div className="detail-row">
                    <strong>Ngày tạo:</strong> {currentEvent.createdAt ? new Date(currentEvent.createdAt).toLocaleString('vi-VN') : 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Người tạo:</strong> {currentEvent.createdBy || 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Biện pháp xử lý:</strong> {currentEvent.handlingMeasures || 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Ghi chú:</strong> {currentEvent.notes || 'N/A'}
                  </div>
                  
                  {/* Related medicines used */}
                  {currentEvent.relatedMedicinesUsed && currentEvent.relatedMedicinesUsed.length > 0 && (
                    <div className="detail-row">
                      <strong>Thuốc đã sử dụng:</strong>
                      <ul>
                        {currentEvent.relatedMedicinesUsed.map((medicine, index) => (
                          <li key={index}>
                            {medicine.medicineName} - Số lượng: {medicine.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="event-details-full">
                  <div className="detail-row">
                    <strong>Mô tả:</strong> {currentEvent.description || 'N/A'}
                  </div>
                  
                  <div className="detail-row student-detail-row">
                    <strong>Học sinh liên quan:</strong>
                    {currentEvent.stuId && currentEvent.stuId.length > 0 ? (
                      <div className="students-detail">
                        {currentEvent.stuId.map(studentId => {
                          const studentInfo = studentsInfo[studentId];
                          return (
                            <div key={studentId} className="student-detail-item-row">
                              {studentInfo ? (
                                <div>
                                  <strong>{studentInfo.fullName}</strong>
                                  <br />
                                  <small>ID: {studentId}</small>
                                  <br />
                                  <small>Class: {studentInfo.className}</small>
                                  <br />
                                  <small>DOB: {studentInfo.dob}</small>
                                  <br />
                                  <small>Gender: {studentInfo.gender}</small>
                                </div>
                              ) : (
                                <span>Loading student {studentId}...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      'Không có'
                    )}
                  </div>
                </div>
                
                <div className="modal-actions event-details-full">
                  <button className="close-btn" onClick={() => setModalOpen(false)}>
                    <span className="btn-icon">❌</span>
                    Đóng
                  </button>
                  <button className="edit-btn" onClick={() => setEditing(true)}>
                    <span className="btn-icon">✏️</span>
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            )}
            
            {/* Edit/Add Form Mode */}
            {(editing || !currentEvent.id) && (
            
            <form onSubmit={handleSubmit}>
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
                  <label htmlFor="incidentType">Loại sự cố <span className="required">*</span></label>
                  <input type="text" name="" required/>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="studentName">Tên học sinh <span className="required">*</span></label>
                  <input
                    type="text"
                    name="studentName"
                    id="studentName"
                    value={currentEvent.studentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="studentClass">Lớp <span className="required">*</span></label>
                  <input
                    type="text"
                    name="studentClass"
                    id="studentClass"
                    value={currentEvent.studentClass}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Ngày xảy ra <span className="required">*</span></label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={currentEvent.date}
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
                  <label htmlFor="handlingMethod">Biện pháp xử lý</label>
                  <select
                    name="handlingMethod"
                    id="handlingMethod"
                    value={currentEvent.handlingMethod}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn biện pháp xử lý --</option>
                    {handlingMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="severity">Mức độ nghiêm trọng</label>
                  <select
                    name="severity"
                    id="severity"
                    value={currentEvent.severity}
                    onChange={handleInputChange}
                  >
                    <option value="Nhẹ">Nhẹ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nặng">Nặng</option>
                  </select>
                </div>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    name="status"
                    id="status"
                    value={currentEvent.status}
                    onChange={handleInputChange}
                  >
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã xử lý">Đã xử lý</option>
                  </select>
                </div>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalEvents;
