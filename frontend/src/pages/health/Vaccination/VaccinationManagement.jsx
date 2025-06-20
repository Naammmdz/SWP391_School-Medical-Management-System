import React, { useState, useEffect } from 'react';
import { Calendar, Search, Plus, Edit, Trash2, FileText, Send, AlertTriangle, CheckCircle, X } from 'lucide-react';
import "./VaccinationManagement.css";
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';

// Vaccine types options
const vaccineTypes = [
  { value: 'Cúm', label: 'Vắc-xin cúm' },
  { value: 'HPV', label: 'Vắc-xin HPV' },
  { value: 'Viêm gan B', label: 'Vắc-xin viêm gan B' },
  { value: 'Covid-19', label: 'Vắc-xin Covid-19' },
  { value: 'Sởi', label: 'Vắc-xin sởi' },
  { value: 'Uốn ván', label: 'Vắc-xin uốn ván' },
  { value: 'Thủy đậu', label: 'Vắc-xin thủy đậu' },
  { value: 'Khác', label: 'Khác' }
];

const statusOptions = [
  { value: 'PENDING', label: 'Chờ phê duyệt' },
  { value: 'APPROVED', label: 'Chấp nhận' },
  { value: 'CANCELLED', label: 'Hủy' }
];

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // State for vaccination events list
  const [vaccinationEvents, setVaccinationEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.userRole === 'ROLE_ADMIN';
  const getOrganizerName = (organizerId) => {
    if (!organizerId) return '';
    const user = users.find(u => u.id === organizerId || u.userId === organizerId);
    return user ? user.fullName || user.name : organizerId;
  };
  // State for current event form
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: '',
    vaccineType: '',
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    location: 'Phòng y tế trường',
    targetClass: '',
    status: 'Sắp tới',
    notes: '',
    vaccineBatch: '',
    manufacturer: '',
    doseAmount: '',
    requiredDocuments: '',
    organizer: '',
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [currentStudentResponses, setCurrentStudentResponses] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    fromDate: '',
    toDate: '',
    vaccineType: ''
  });
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    eventId: null,
    subject: '',
    message: '',
    deadlineDate: '',
    requiredDocuments: '',
    sendToAll: true,
    specificClass: ''
  });

  // Fetch vaccination events from backend API
  const fetchVaccinationEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await VaccinationService.getAllVaccinationCampaigns({
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(response.data) ? response.data : response.data.content || [];
      const mappedData = data.map((item, idx) => ({
        id: item.id || item.campaignId || idx + 1,
        title: item.campaignName || '',
        vaccineType: item.vaccineType || '',
        description: item.description || '',
        scheduledDate: item.scheduledDate || '',
        scheduledTime: item.scheduledTime || '09:00',
        location: item.location || 'Phòng y tế trường',
        targetClass: item.targetGroup || '',
        status: item.status || 'Sắp tới',
        notes: item.notes || '',
        vaccineBatch: item.vaccineBatch || '',
        manufacturer: item.manufacturer || '',
        doseAmount: item.doseAmount || '',
        organizer: item.organizer || item.approvedBy || '', // id người tổ chức
        requiredDocuments: item.requiredDocuments || '',
        responses: item.responses || {
          total: 0,
          confirmed: 0,
          declined: 0,
          pending: 0
        }
      }));
      setVaccinationEvents(mappedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinationEvents();
  }, []);

  const approveVaccinationCampaign = async (event) => {
    if (!window.confirm('Bạn có chắc muốn duyệt chiến dịch này?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await VaccinationService.approveVaccinationCampaign(
        event.id,
        { status: 'APPROVED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVaccinationEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, status: 'APPROVED' } : e
        )
      );
    } catch (error) {
      alert('Có lỗi khi duyệt chiến dịch!');
    }
    setLoading(false);
  };

  // Update vaccination event
  const updateVaccinationEvent = async (id, updatedEvent) => {
    setLoading(true);
    try {
      setVaccinationEvents(
        vaccinationEvents.map(event => 
          event.id === id ? {...updatedEvent, id, responses: event.responses} : event
        )
      );
      setModalOpen(false);
      setEditing(false);
      resetForm();
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
      setLoading(false);
    } catch (error) {
      console.error('Error updating vaccination event:', error);
      setLoading(false);
    }
  };

  // Delete vaccination event
  const deleteVaccinationEvent = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sự kiện tiêm chủng này?')) {
      setLoading(true);
      try {
        setVaccinationEvents(vaccinationEvents.filter(event => event.id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error deleting vaccination event:', error);
        setLoading(false);
      }
    }
  };

  // Open form to edit event
  const editVaccinationEvent = (event) => {
    navigate('/capnhatthongtintiemchung', { state: { event } });
  };

  // Reset form fields
  const resetForm = () => {
    setCurrentEvent({
      id: null,
      title: '',
      vaccineType: '',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      location: 'Phòng y tế trường',
      targetGroup: '',
      status: 'Sắp tới',
      notes: '',
      vaccineBatch: '',
      manufacturer: '',
      doseAmount: '',
      requiredDocuments: ''
    });
    setSelectedStudents([]);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({...currentEvent, [name]: value});
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({...filters, [name]: value});
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentEvent.title || !currentEvent.vaccineType || !currentEvent.scheduledDate) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    if (editing) {
      updateVaccinationEvent(currentEvent.id, currentEvent);
    } else {
      createVaccinationEvent(currentEvent);
    }
  };

  // Open notification form modal
  const openNotificationModal = (event) => {
    setNotification({
      eventId: event.id,
      subject: `Thông báo tiêm chủng: ${event.title}`,
      message: `Kính gửi Quý phụ huynh,\n\nNhà trường tổ chức chương trình tiêm chủng ${event.vaccineType} cho học sinh vào ngày ${new Date(event.scheduledDate).toLocaleDateString('vi-VN')}.\n\nKính mong Quý phụ huynh xác nhận cho con tham gia chương trình này.\n\nTrân trọng,\nPhòng Y tế`,
      deadlineDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      requiredDocuments: event.requiredDocuments || '',
      sendToAll: true,
      specificClass: ''
    });
    setNotificationModalOpen(true);
  };

  // Send notifications to parents
  const sendNotifications = async (e) => {
    e.preventDefault();
    if (!notification.subject || !notification.message || !notification.deadlineDate) {
      alert('Vui lòng điền đầy đủ thông tin thông báo');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedEvents = vaccinationEvents.map(event => {
        if (event.id === notification.eventId) {
          return {
            ...event,
            notificationSent: true,
            notificationDate: new Date().toISOString()
          };
        }
        return event;
      });
      setVaccinationEvents(updatedEvents);
      setNotificationModalOpen(false);
      alert('Thông báo đã được gửi thành công đến phụ huynh!');
      setLoading(false);
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Có lỗi xảy ra khi gửi thông báo. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // Open responses modal to see parent responses
  const viewResponses = (event) => {
    const mockResponses = [
      { id: 1, studentName: 'Nguyễn Văn A', className: '10A1', status: 'Xác nhận', parentNote: 'Con đã tiêm đầy đủ', responseDate: '2023-09-10' },
      { id: 2, studentName: 'Trần Thị B', className: '10A1', status: 'Từ chối', parentNote: 'Con bị dị ứng với thành phần vắc-xin', responseDate: '2023-09-11' },
      { id: 3, studentName: 'Lê Văn C', className: '10A2', status: 'Xác nhận', parentNote: '', responseDate: '2023-09-12' },
      { id: 4, studentName: 'Phạm Thị D', className: '10A2', status: 'Chưa phản hồi', parentNote: '', responseDate: '' },
      { id: 5, studentName: 'Hoàng Văn E', className: '10A3', status: 'Xác nhận', parentNote: 'Cần theo dõi sau tiêm do có tiền sử dị ứng', responseDate: '2023-09-10' },
    ];
    setCurrentStudentResponses(mockResponses);
    setResponseModalOpen(true);
  };

  // Apply filters to the vaccination events list
  const filteredEvents = vaccinationEvents.filter(event => {
    return (
      (filters.searchTerm === '' || 
        event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        event.vaccineType.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.status === '' || event.status === filters.status) &&
      (filters.vaccineType === '' || event.vaccineType === filters.vaccineType) &&
      (filters.fromDate === '' || new Date(event.scheduledDate) >= new Date(filters.fromDate)) &&
      (filters.toDate === '' || new Date(event.scheduledDate) <= new Date(filters.toDate))
    );
  });

  // Handle notification input changes
  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNotification({...notification, [name]: value});
  };
  return (
    <div className="nurse-page vaccination-management-page">
      <h1 className="page-title">Quản lý tiêm chủng</h1>
      
      {/* Success message */}
      <table className="events-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Loại vắc-xin</th>
            <th>Ngày tiêm</th>
            <th>Đối tượng</th>
            <th>Người tổ chức</th>
            <th>Trạng thái</th>
            <th>Phản hồi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.vaccineType}</td>
                <td>{new Date(event.scheduledDate).toLocaleDateString('vi-VN')} {event.scheduledTime}</td>
                <td>{event.targetClass}</td>
                <td>{getOrganizerName(event.organizer)}</td>
                <td>
                  <span className={`status ${
                    event.status === 'Hoàn thành' ? 'complete' : 
                    event.status === 'Đã hủy' ? 'cancelled' : 
                    event.status === 'APPROVED' ? 'approved' : 'upcoming'
                  }`}>
                    {event.status === 'APPROVED' ? 'Đã duyệt' : event.status}
                  </span>
                </td>
                <td className="response-summary">
                  <div className="response-counts">
                    <span className="confirmed">{event.responses.confirmed}</span> / 
                    <span className="declined">{event.responses.declined}</span> / 
                    <span className="pending">{event.responses.pending}</span>
                  </div>
                  <div className="response-labels">
                    <span className="confirmed-label">Xác nhận</span> /
                    <span className="declined-label">Từ chối</span> / 
                    <span className="pending-label">Chưa phản hồi</span>
                  </div>
                </td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => editVaccinationEvent(event)}>
                    <Edit size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => deleteVaccinationEvent(event.id)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="send-btn" onClick={() => openNotificationModal(event)}>
                    <Send size={16} />
                  </button>
                  <button className="view-btn" onClick={() => viewResponses(event)}>
                    <FileText size={16} />
                  </button>
                  {isAdmin && event.status !== 'APPROVED' && (
                    <button
                      className="approve-btn"
                      title="Chấp nhận"
                      onClick={() => approveVaccinationCampaign(event)}
                      style={{ marginLeft: 4, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                    >
                      <CheckCircle size={16} style={{ verticalAlign: 'middle' }} /> Chấp nhận
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">Không có dữ liệu sự kiện tiêm chủng</td>
            </tr>
          )}
        </tbody>
      </table>
      
      
      {/* Vaccination Event Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>{editing ? 'Sửa sự kiện tiêm chủng' : 'Tạo sự kiện tiêm chủng mới'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Tiêu đề <span className="required">*</span></label>
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
                  <label htmlFor="vaccineType">Loại vắc-xin <span className="required">*</span></label>
                  <select
                    name="vaccineType"
                    id="vaccineType"
                    value={currentEvent.vaccineType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn loại vắc-xin --</option>
                    {vaccineTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="scheduledDate">Ngày tiêm <span className="required">*</span></label>
                  <input
                    type="date"
                    name="scheduledDate"
                    id="scheduledDate"
                    value={currentEvent.scheduledDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="scheduledTime">Giờ tiêm</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    id="scheduledTime"
                    value={currentEvent.scheduledTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
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
                <div className="form-group">
                  <label htmlFor="targetClass">Đối tượng tiêm</label>
                  <input
                    type="text"
                    name="targetClass"
                    id="targetClass"
                    value={currentEvent.targetClass}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Khối 10, Lớp 11A1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  name="description"
                  id="description"
                  value={currentEvent.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vaccineBatch">Lô vắc-xin</label>
                  <input
                    type="text"
                    name="vaccineBatch"
                    id="vaccineBatch"
                    value={currentEvent.vaccineBatch}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manufacturer">Nhà sản xuất</label>
                  <input
                    type="text"
                    name="manufacturer"
                    id="manufacturer"
                    value={currentEvent.manufacturer}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doseAmount">Liều lượng</label>
                  <input
                    type="text"
                    name="doseAmount"
                    id="doseAmount"
                    value={currentEvent.doseAmount}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 0.5ml"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    name="status"
                    id="status"
                    value={currentEvent.status}
                    onChange={handleInputChange}
                  >
                    <option value="Sắp tới">Sắp tới</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="requiredDocuments">Giấy tờ yêu cầu</label>
                <textarea
                  name="requiredDocuments"
                  id="requiredDocuments"
                  value={currentEvent.requiredDocuments}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Ví dụ: Phiếu đồng ý của phụ huynh, sổ tiêm chủng"
                ></textarea>
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

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Notification Modal */}
      {notificationModalOpen && (
        <div className="modal">
          <div className="modal-content notification-modal">
            <span className="close" onClick={() => setNotificationModalOpen(false)}>&times;</span>
            <h2>Gửi thông báo tiêm chủng</h2>
            
            <form onSubmit={sendNotifications}>
              <div className="form-group">
                <label htmlFor="subject">Tiêu đề <span className="required">*</span></label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={notification.subject}
                  onChange={handleNotificationChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Nội dung thông báo <span className="required">*</span></label>
                <textarea
                  name="message"
                  id="message"
                  value={notification.message}
                  onChange={handleNotificationChange}
                  rows="6"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deadlineDate">Hạn phản hồi <span className="required">*</span></label>
                  <input
                    type="date"
                    name="deadlineDate"
                    id="deadlineDate"
                    value={notification.deadlineDate}
                    onChange={handleNotificationChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="requiredDocuments">Giấy tờ yêu cầu</label>
                  <input
                    type="text"
                    name="requiredDocuments"
                    id="requiredDocuments"
                    value={notification.requiredDocuments}
                    onChange={handleNotificationChange}
                    placeholder="Ví dụ: Phiếu đồng ý, sổ tiêm chủng"
                  />
                </div>
              </div>
              
              <div className="form-group notification-target">
                <label>Đối tượng nhận thông báo</label>
                <div className="checkbox-group">
                  <input
                    type="radio"
                    id="sendToAll"
                    name="sendToAll"
                    checked={notification.sendToAll}
                    onChange={() => setNotification({...notification, sendToAll: true, specificClass: ''})}
                  />
                  <label htmlFor="sendToAll">Tất cả học sinh thuộc đối tượng tiêm</label>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="radio"
                    id="sendToSpecific"
                    name="sendToAll"
                    checked={!notification.sendToAll}
                    onChange={() => setNotification({...notification, sendToAll: false})}
                  />
                  <label htmlFor="sendToSpecific">Lớp cụ thể</label>
                  {!notification.sendToAll && (
                    <input
                      type="text"
                      name="specificClass"
                      value={notification.specificClass}
                      onChange={handleNotificationChange}
                      placeholder="Ví dụ: 10A1, 11B2"
                      className="specific-class-input"
                    />
                  )}
                </div>
              </div>
              
              <div className="notification-warning">
                <AlertTriangle size={16} />
                <p>Thông báo sẽ được gửi đến phụ huynh của học sinh thuộc đối tượng tiêm. Phụ huynh sẽ nhận được thông báo và phiếu xác nhận tiêm chủng.</p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setNotificationModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Parent Responses Modal */}
      {responseModalOpen && (
        <div className="modal">
          <div className="modal-content responses-modal">
            <span className="close" onClick={() => setResponseModalOpen(false)}>&times;</span>
            <h2>Phản hồi từ phụ huynh</h2>
            
            <div className="response-summary-header">
              <div className="response-stats">
                <div className="stat-item">
                  <span className="stat-label">Tổng số:</span>
                  <span className="stat-value">{currentStudentResponses.length}</span>
                </div>
                <div className="stat-item confirmed">
                  <CheckCircle size={16} />
                  <span className="stat-label">Xác nhận:</span>
                  <span className="stat-value">
                    {currentStudentResponses.filter(r => r.status === 'Xác nhận').length}
                  </span>
                </div>
                <div className="stat-item declined">
                  <X size={16} />
                  <span className="stat-label">Từ chối:</span>
                  <span className="stat-value">
                    {currentStudentResponses.filter(r => r.status === 'Từ chối').length}
                  </span>
                </div>
                <div className="stat-item pending">
                  <AlertTriangle size={16} />
                  <span className="stat-label">Chưa phản hồi:</span>
                  <span className="stat-value">
                    {currentStudentResponses.filter(r => r.status === 'Chưa phản hồi').length}
                  </span>
                </div>
              </div>
            </div>
            
            <table className="responses-table">
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>Lớp</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú của phụ huynh</th>
                  <th>Ngày phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {currentStudentResponses.map(response => (
                  <tr key={response.id}>
                    <td>{response.studentName}</td>
                    <td>{response.className}</td>
                    <td>
                      <span className={`response-status ${response.status.toLowerCase().replace(' ', '-')}`}>
                        {response.status === 'Xác nhận' && <CheckCircle size={14} />}
                        {response.status === 'Từ chối' && <X size={14} />}
                        {response.status === 'Chưa phản hồi' && <AlertTriangle size={14} />}
                        {response.status}
                      </span>
                    </td>
                    <td>{response.parentNote || '(Không có)'}</td>
                    <td>{response.responseDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="form-actions">
              <button type="button" className="close-btn" onClick={() => setResponseModalOpen(false)}>
                Đóng
              </button>
              <button type="button" className="export-btn">
                Xuất danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement; 