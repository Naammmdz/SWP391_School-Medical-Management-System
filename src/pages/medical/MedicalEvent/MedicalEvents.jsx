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

const MedicalEvents = () => {
  // State cho danh sách sự cố y tế
  const [medicalEvents, setMedicalEvents] = useState([]);
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalEvents;
