import React, { useState, useEffect } from 'react';
import './MedicalEvents.css';
import MedicalEventService from '../../../services/MedicalEventService';
import studentService from '../../../services/StudentService';
import StudentSelectionModal from '../../../components/StudentSelectionModal';

// Enum values from backend
const SEVERITY_LEVELS = [
  { value: 'MINOR', label: 'Nhẹ' },
  { value: 'MODERATE', label: 'Trung bình' },
  { value: 'MAJOR', label: 'Nặng' },
  { value: 'CRITICAL', label: 'Cấp cứu' }
];

const MEDICAL_EVENT_STATUS = [
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã xử lý' }
];

const EVENT_TYPES = [
  { value: 'INJURY', label: 'Chấn thương' },
  { value: 'ILLNESS', label: 'Bệnh tật' },
  { value: 'ALLERGIC_REACTION', label: 'Phản ứng dị ứng' },
  { value: 'EMERGENCY', label: 'Cấp cứu' },
  { value: 'OTHER', label: 'Khác' }
];

const MedicalEvents = () => {
  // Helper functions for enum translation
  const getSeverityLevelText = (severityLevel) => {
    switch (severityLevel) {
      case 'MINOR': return 'Nhẹ';
      case 'MODERATE': return 'Trung bình';
      case 'MAJOR': return 'Nặng';
      case 'CRITICAL': return 'Cấp cứu';
      default: return severityLevel || 'Không có';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'PROCESSING': return 'Đang xử lý';
      case 'RESOLVED': return 'Đã xử lý';
      default: return status || 'Không có';
    }
  };
  
  // State cho danh sách sự cố y tế
  const [medicalEvents, setMedicalEvents] = useState([]);
  // State cho thông tin học sinh
  const [studentsInfo, setStudentsInfo] = useState({});
  // State cho inventory items used
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
  // State cho form thêm/sửa sự cố - matching backend DTO
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: '',
    stuId: [], // Array of student IDs
    eventType: '',
    eventDate: new Date().toISOString().slice(0, 16), // datetime-local format
    location: '',
    description: '',
    relatedItemUsed: [], // Array of InventoryUsedInMedicalEventRequestDTO objects
    notes: '',
    handlingMeasures: '',
    severityLevel: 'MINOR',
    status: 'PROCESSING'
  });
  
  // State for student selection
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [studentSelectionModalOpen, setStudentSelectionModalOpen] = useState(false);
  const [resetStudentModal, setResetStudentModal] = useState(false);
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
  
  // Hàm lấy danh sách tất cả học sinh
  const fetchAllStudents = async () => {
    try {
      const response = await studentService.getAllStudents();
      if (response.data && Array.isArray(response.data)) {
        setAvailableStudents(response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Hàm lấy danh sách lớp
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


  // Hàm mở modal chọn học sinh
  const handleOpenStudentModal = () => {
    setStudentSelectionModalOpen(true);
  };

  // Hàm đóng modal chọn học sinh
  const handleCloseStudentModal = () => {
    setStudentSelectionModalOpen(false);
  };

  // Hàm xác nhận chọn học sinh
  const handleConfirmStudentSelection = (selectedIds, selectedStudentObjects) => {
    setCurrentEvent({...currentEvent, stuId: selectedIds});
    setSelectedStudents(selectedStudentObjects);
    setStudentSelectionModalOpen(false);
  };

  // Hàm xóa học sinh khỏi danh sách đã chọn
  const handleRemoveStudent = (studentId) => {
    const updatedStudentIds = currentEvent.stuId.filter(id => id !== studentId);
    setCurrentEvent({...currentEvent, stuId: updatedStudentIds});
    const updatedSelectedStudents = selectedStudents.filter(s => s.studentId !== studentId);
    setSelectedStudents(updatedSelectedStudents);
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

  // Hàm thêm sự cố y tế mới
  const addMedicalEvent = async (event) => {
    setLoading(true);
    try {
      // Transform event data to match backend DTO
      const eventDTO = {
        title: event.title,
        stuId: event.stuId,
        eventType: event.eventType,
        eventDate: event.eventDate,
        location: event.location,
        description: event.description,
        relatedItemUsed: event.relatedItemUsed || [],
        notes: event.notes,
        handlingMeasures: event.handlingMeasures,
        severityLevel: event.severityLevel,
        status: event.status
      };
      
      // Debug logging
      console.log('=== MEDICAL EVENT DEBUG ===');
      console.log('Sending Event DTO:', JSON.stringify(eventDTO, null, 2));
      console.log('Student IDs:', eventDTO.stuId);
      console.log('Event Date:', eventDTO.eventDate);
      console.log('Severity Level:', eventDTO.severityLevel);
      console.log('Status:', eventDTO.status);
      console.log('Related Items Used:', eventDTO.relatedItemUsed);
      
      const response = await MedicalEventService.createMedicalEvent(eventDTO);
      
      console.log('Medical event created successfully:', response.data);
      
      // Refresh the medical events list
      await fetchMedicalEvents();
      
      setModalOpen(false);
      resetCurrentEvent();
      setLoading(false);
      
      alert('Tạo sự cố y tế thành công!');
      
    } catch (error) {
      console.error('=== MEDICAL EVENT ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        
        // Try to extract detailed error message from response
        let serverMessage = 'Unknown server error';
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            serverMessage = error.response.data;
          } else if (error.response.data.message) {
            serverMessage = error.response.data.message;
          } else if (error.response.data.error) {
            serverMessage = error.response.data.error;
          }
        }
        
        console.error('Server error message:', serverMessage);
        
        let errorMessage = 'Không thể thêm sự cố y tế. Vui lòng thử lại.';
        
        if (error.response.status === 400) {
          errorMessage = `Lỗi dữ liệu không hợp lệ: ${serverMessage}`;
        } else if (error.response.status === 401) {
          errorMessage = 'Bạn cần đăng nhập lại để thực hiện thao tác này.';
          // Redirect to login
          window.location.href = '/login';
        } else if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
        } else if (error.response.status === 500) {
          errorMessage = `Lỗi máy chủ: ${serverMessage}`;
        }
        
        alert(errorMessage);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Có lỗi xảy ra khi chuẩn bị yêu cầu.');
      }
      
      setLoading(false);
    }
  };
  
  // Hàm reset form
  const resetCurrentEvent = () => {
    setCurrentEvent({
      id: null,
      title: '',
      stuId: [],
      eventType: '',
      eventDate: new Date().toISOString().slice(0, 16),
      location: '',
      description: '',
      relatedItemUsed: [],
      notes: '',
      handlingMeasures: '',
      severityLevel: 'MINOR',
      status: 'PROCESSING'
    });
    setSelectedStudents([]);
    setSelectedInventoryItems([]);
  };

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
      resetCurrentEvent();
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
    // Set selected students for multi-select
    if (event.stuId && Array.isArray(event.stuId)) {
      const students = event.stuId.map(id => availableStudents.find(s => s.id === id)).filter(Boolean);
      setSelectedStudents(students);
    }
    // Set selected inventory items for editing
    if (event.relatedItemUsed && Array.isArray(event.relatedItemUsed)) {
      setSelectedInventoryItems(event.relatedItemUsed);
    }
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
    
    console.log('=== FORM VALIDATION ===');
    console.log('Current Event:', currentEvent);
    console.log('Selected Students:', selectedStudents);
    console.log('Available Classes:', availableClasses);
    
    // Enhanced validation
    const validationErrors = [];
    
    if (!currentEvent.title || currentEvent.title.trim() === '') {
      validationErrors.push('Tiêu đề sự cố không được để trống');
    }
    
    if (!currentEvent.eventType || currentEvent.eventType.trim() === '') {
      validationErrors.push('Loại sự cố không được để trống');
    }
    
    if (!currentEvent.eventDate) {
      validationErrors.push('Ngày xảy ra sự cố không được để trống');
    }
    
    if (!currentEvent.stuId || currentEvent.stuId.length === 0) {
      validationErrors.push('Phải chọn ít nhất một học sinh');
    }
    
    // Check if selected students are valid
    if (currentEvent.stuId && currentEvent.stuId.length > 0) {
      const invalidStudents = currentEvent.stuId.filter(id => !id || id === null || id === undefined);
      if (invalidStudents.length > 0) {
        validationErrors.push('Có học sinh không hợp lệ trong danh sách đã chọn');
      }
    }
    
    // Check if eventDate is valid
    if (currentEvent.eventDate) {
      const eventDateObj = new Date(currentEvent.eventDate);
      if (isNaN(eventDateObj.getTime())) {
        validationErrors.push('Ngày xảy ra sự cố không hợp lệ');
      }
    }
    
    // Check severityLevel
    const validSeverityLevels = ['MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'];
    if (!validSeverityLevels.includes(currentEvent.severityLevel)) {
      validationErrors.push('Mức độ nghiêm trọng không hợp lệ');
    }
    
    // Check status
    const validStatuses = ['PROCESSING', 'RESOLVED'];
    if (!validStatuses.includes(currentEvent.status)) {
      validationErrors.push('Trạng thái không hợp lệ');
    }
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      alert('Lỗi kiểm tra dữ liệu:\n' + validationErrors.join('\n'));
      return;
    }
    
    console.log('Form validation passed. Submitting...');
    
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
  
  // Xử lý thay đổi student selection
  const handleStudentSelection = (studentId) => {
    let updatedStudentIds;
    
    if (currentEvent.stuId.includes(studentId)) {
      // Remove student
      updatedStudentIds = currentEvent.stuId.filter(id => id !== studentId);
    } else {
      // Add student
      updatedStudentIds = [...currentEvent.stuId, studentId];
    }
    
    setCurrentEvent({...currentEvent, stuId: updatedStudentIds});
  };
  
  // Xử lý thay đổi inventory item selection
  const handleInventoryItemSelection = (itemId, quantity = 1) => {
    if (!itemId) return;
    
    const existingItemIndex = selectedInventoryItems.findIndex(item => item.inventoryId === itemId);
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = [...selectedInventoryItems];
      updatedItems[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      updatedItems = [...selectedInventoryItems, {
        inventoryId: itemId,
        quantity: quantity
      }];
    }
    
    setSelectedInventoryItems(updatedItems);
    setCurrentEvent({...currentEvent, relatedItemUsed: updatedItems});
  };
  
  // Xử lý xóa inventory item
  const handleRemoveInventoryItem = (itemId) => {
    const updatedItems = selectedInventoryItems.filter(item => item.inventoryId !== itemId);
    setSelectedInventoryItems(updatedItems);
    setCurrentEvent({...currentEvent, relatedItemUsed: updatedItems});
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
    fetchAllStudents();
    fetchAvailableClasses();
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
          resetCurrentEvent();
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
                                  <small>ID: {studentId} | Lớp: {studentInfo.className}</small>
                                </span>
                              ) : (
                                <span>Đang tải thông tin học sinh {studentId}...</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span>Chưa gán học sinh</span>
                    )}
                  </td>
                  <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : 'Không có'}</td>
                  <td>{event.handlingMeasures || 'Không có'}</td>
                  <td>
                    <span className={`status ${event.status === 'PROCESSING' ? 'pending' : 'resolved'}`}>
                      {getStatusText(event.status)}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="view-btn" onClick={() => viewMedicalEventDetails(event)} title="Xem chi tiết">
                      <span className="btn-icon">👁️</span>
                      Xem
                    </button>
                    <button className="edit-btn" onClick={() => editMedicalEvent(event)} title="Chỉnh sửa">
                      <span className="btn-icon">✏️</span>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => deleteMedicalEvent(event.id)} title="Xóa">
                      <span className="btn-icon">🗑️</span>
                      Xóa
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
                    <strong>Ngày xảy ra:</strong> {currentEvent.eventDate ? new Date(currentEvent.eventDate).toLocaleString('vi-VN') : 'Không có'}
                  </div>
                  <div className="detail-row">
                    <strong>Địa điểm:</strong> {currentEvent.location || 'Không có'}
                  </div>
                  <div className="detail-row">
                    <strong>Mức độ nghiêm trọng:</strong> {getSeverityLevelText(currentEvent.severityLevel)}
                  </div>
                  <div className="detail-row">
                    <strong>Trạng thái:</strong> {getStatusText(currentEvent.status)}
                  </div>
                </div>
                
                <div className="event-details-right">
                  <div className="detail-row">
                    <strong>Ngày tạo:</strong> {currentEvent.createdAt ? new Date(currentEvent.createdAt).toLocaleString('vi-VN') : 'Không có'}
                  </div>
                  <div className="detail-row">
                    <strong>Người tạo:</strong> {currentEvent.createdBy || 'Không có'}
                  </div>
                  <div className="detail-row">
                    <strong>Biện pháp xử lý:</strong> {currentEvent.handlingMeasures || 'Không có'}
                  </div>
                  <div className="detail-row">
                    <strong>Ghi chú:</strong> {currentEvent.notes || 'Không có'}
                  </div>
                  
                  {/* Related medicines/inventory items used */}
                  {currentEvent.relatedMedicinesUsed && currentEvent.relatedMedicinesUsed.length > 0 && (
                    <div className="detail-row">
                      <strong>Vật phẩm y tế đã sử dụng:</strong>
                      <ul className="inventory-used-list">
                        {currentEvent.relatedMedicinesUsed.map((item, index) => (
                          <li key={index} className="inventory-used-item">
                            <div className="item-info">
                              <strong>{item.medicineName || `Vật phẩm ID: ${item.medicineId}`}</strong>
                              <div className="item-details">
                                <span className="quantity">Số lượng: {item.quantityUsed || item.quantity || 0}</span>
                                {item.unit && <span className="unit">({item.unit})</span>}
                                {item.usageNote && (
                                  <div className="usage-note">
                                    <em>Ghi chú: {item.usageNote}</em>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="event-details-full">
                  <div className="detail-row">
                    <strong>Mô tả:</strong> {currentEvent.description || 'Không có'}
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
                                  <small>Lớp: {studentInfo.className}</small>
                                  <br />
                                  <small>Ngày sinh: {studentInfo.dob}</small>
                                  <br />
                                  <small>Giới tính: {studentInfo.gender}</small>
                                </div>
                              ) : (
                                <span>Đang tải học sinh {studentId}...</span>
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
                  <label htmlFor="eventType">Loại sự cố <span className="required">*</span></label>
                  <input
                    type="text"
                    name="eventType"
                    id="eventType"
                    value={currentEvent.eventType}
                    onChange={handleInputChange}
                    placeholder="Nhập loại sự cố (ví dụ: Chấn thương, Bệnh tật, Dị ứng...)"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="students">Học sinh liên quan <span className="required">*</span></label>
                  <div className="students-selection">
                    <div className="student-selection-actions">
                      <button 
                        type="button" 
                        onClick={handleOpenStudentModal}
                        className="open-student-modal-btn"
                      >
                        Chọn học sinh
                      </button>
                    </div>
                    
                    {currentEvent.stuId.length > 0 && (
                      <div className="selected-students-summary">
                        <strong>Đã chọn {currentEvent.stuId.length} học sinh:</strong>
                        <div className="selected-students-list">
                          {currentEvent.stuId.map(studentId => {
                            const studentInfo = studentsInfo[studentId] || availableStudents.find(s => s.studentId === studentId);
                            return (
                              <span key={studentId} className="selected-student-tag">
                                {studentInfo ? studentInfo.fullName : `ID: ${studentId}`} (ID: {studentId})
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveStudent(studentId)}
                                  className="remove-student-btn"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="handlingMeasures">Biện pháp xử lý</label>
                  <textarea
                    name="handlingMeasures"
                    id="handlingMeasures"
                    value={currentEvent.handlingMeasures}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Mô tả các biện pháp xử lý đã thực hiện..."
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="severityLevel">Mức độ nghiêm trọng</label>
                  <select
                    name="severityLevel"
                    id="severityLevel"
                    value={currentEvent.severityLevel}
                    onChange={handleInputChange}
                  >
                    {SEVERITY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
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
                  placeholder="Mô tả chi tiết về sự cố..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="inventoryItems">Vật phẩm y tế đã sử dụng</label>
                <div className="inventory-selection">
                  <div className="inventory-input-row">
                    <select 
                      onChange={(e) => {
                        const itemId = parseInt(e.target.value);
                        if (itemId) {
                          handleInventoryItemSelection(itemId, 1);
                          e.target.value = '';
                        }
                      }}
                      value=""
                    >
                      <option value="">-- Chọn vật phẩm y tế --</option>
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Còn lại: {item.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="selected-inventory-items">
                    {selectedInventoryItems.map(item => {
                      const inventoryItem = inventoryItems.find(inv => inv.id === item.inventoryId);
                      return (
                        <div key={item.inventoryId} className="selected-inventory-item">
                          <span>{inventoryItem?.name || `ID: ${item.inventoryId}`}</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleInventoryItemSelection(item.inventoryId, parseInt(e.target.value) || 1)}
                            className="quantity-input"
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveInventoryItem(item.inventoryId)}
                            className="remove-item-btn"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
                    {MEDICAL_EVENT_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
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

export default MedicalEvents;
