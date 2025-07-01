import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Tooltip,
  Statistic,
  Progress,
  Alert,
  Dropdown,
  Badge,
  Popconfirm,
  Divider,
  Descriptions,
  Empty
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BarChartOutlined,
  SendOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import vaccinationService from '../../../services/VaccinationService';
import "./VaccinationManagement.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [responsesModalVisible, setResponsesModalVisible] = useState(false);
  const [campaignResponses, setCampaignResponses] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch all vaccination campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await vaccinationService.getAllVaccinationCampaigns(config);
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Calculate statistics
      const total = data.length;
      const pending = data.filter(c => c.status === 'PENDING').length;
      const approved = data.filter(c => c.status === 'APPROVED').length;
      const rejected = data.filter(c => c.status === 'REJECTED').length;
      
      setStats({ total, pending, approved, rejected });
      setCampaigns(data);
    // Lọc chiến dịch phù hợp với lớp học sinh
    function removeVietnameseTones(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
    const filtered = data.filter(item => {
  if (!studentClass || !item.targetGroup) return false;
  const target = item.targetGroup.toLowerCase().trim();
  const studentClassLower = studentClass.toLowerCase().trim();

  // Chuẩn hóa tiếng Việt không dấu
  function removeVietnameseTones(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }
  const targetNoSign = removeVietnameseTones(target).replace(/\s/g, '');
  const studentClassNoSign = removeVietnameseTones(studentClassLower).replace(/\s/g, '');

  // Toàn trường
  if (targetNoSign === 'toantruong') return true;

  // Khớp chính xác
  if (targetNoSign === studentClassNoSign) return true;

  // Nếu target là "khoi 4" hoặc "khối 4" thì khớp các lớp bắt đầu bằng "4"
  const khoiMatch = targetNoSign.match(/khoi(\d+)/);
  if (khoiMatch && studentClassNoSign.startsWith(khoiMatch[1])) return true;

  // Nếu target chứa tên lớp
  if (targetNoSign.includes(studentClassNoSign)) return true;
  if (studentClassNoSign.includes(targetNoSign)) return true;

  return false;
});

    const mapped = filtered.map(item => {
      let status = 'Chưa phản hồi';
      let responseNote = '';
      let responseDate = '';
      
      // Lấy parentConfirm trực tiếp từ item (API response)
      console.log('Campaign item data:', item); // Debug log
      console.log('parentConfirm value:', item.parentConfirm); // Debug log for parentConfirm specifically
      
      if (item.parentConfirm !== undefined) {
        // Sử dụng parentConfirm từ API response để xác định trạng thái
        if (item.parentConfirm === null) {
          status = 'Chưa phản hồi';
          console.log('Status set to: Chưa phản hồi (parentConfirm is null)');
        } else if (item.parentConfirm === true) {
          status = 'Xác nhận';
          console.log('Status set to: Xác nhận (parentConfirm is true)');
        } else if (item.parentConfirm === false) {
          status = 'Từ chối';
          console.log('Status set to: Từ chối (parentConfirm is false)');
        }
        
        // Lấy thông tin ghi chú và ngày phản hồi từ item nếu có
        responseNote = item.note || '';
        responseDate = item.responseDate || '';
      } else {
        console.log('parentConfirm is undefined, keeping default status: Chưa phản hồi');
      }
      
      return {
        id: item.campaignId,
        title: `Thông báo tiêm chủng: ${item.campaignName}`,
        campaignName: item.campaignName,
        targetGroup: item.targetGroup,
        type: item.type,
        address: item.address,
        organizerId: item.approvedBy,
        description: item.description,
        date: item.scheduledDate, // giữ nguyên, format khi hiển thị
        status,
        isNew: status === 'Chưa phản hồi',
        sentDate: item.createdAt, // giữ nguyên, format khi hiển thị
        responseNote,
        responseDate,
        requiredDocuments: 'Phiếu đồng ý của phụ huynh, giấy tờ tùy thân',
        time: '',
        location: item.address,
      };
    });
    setNotifications(mapped);
    setLoading(false);
  } catch (error) {
    setNotifications([]);
    setLoading(false);
  }
};
// Gửi phản hồi xác nhận/từ chối (gọi API thực tế)
const sendResponse = async (e) => {
  e.preventDefault();
  if (!responseData.response) {
    alert('Vui lòng chọn phản hồi của bạn');
    return;
  }
  setSubmitting(true);
  try {
    // Lấy studentId từ localStorage
    const studentId = localStorage.getItem('selectedStudentId');
    if (!studentId) {
      alert('Vui lòng chọn học sinh trước khi phản hồi!');
      setSubmitting(false);
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // Nếu xác nhận thì gọi API đăng ký tiêm chủng
    if (responseData.response === 'confirm')  {
      // Xem dữ liệu trước khi gửi
      console.log('Gửi đăng ký tiêm chủng:', {
        campaignId: responseData.campaignId,
        studentId: Number(studentId),
        
        config
      });
      // Đúng thứ tự: campaignId, studentId, config
      await vaccinationService.parentApproveCampaign(
        responseData.campaignId,
        Number(studentId),
        config
      );
    }
    if( responseData.response === 'decline') {
       console.log('Gửi từ chối tiêm chủng:', {
        campaignId: responseData.campaignId,
        studentId: Number(studentId),
        config
      });
      // Gọi API từ chối tiêm chủng
      await vaccinationService.parentRejectCampaign(
        responseData.campaignId,
        Number(studentId),
        config
      );
    }
    // Nếu từ chối thì có thể gọi API khác nếu backend hỗ trợ, hoặc chỉ cập nhật UI

    setNotifications(notifications.map(notification => {
      if (notification.id === responseData.campaignId) {
        return {
          ...notification,
          status: responseData.response === 'confirm' ? 'Xác nhận' : 'Từ chối',
          responseNote: responseData.note,
          responseDate: new Date().toISOString().split('T')[0],
          isNew: false
        };
      }
      return notification;
    }));
    if (activeNotification && activeNotification.id === responseData.campaignId) {
      setActiveNotification({
        ...activeNotification,
        status: responseData.response === 'confirm' ? 'Xác nhận' : 'Từ chối',
        responseNote: responseData.note,
        responseDate: new Date().toISOString().split('T')[0],
        isNew: false
      });
    }
    setShowResponseForm(false);
    setResponseSuccess(true);
    setResponseData({
      campaignId: null,
      response: '',
      note: ''
    });
    setTimeout(() => {
      setResponseSuccess(false);
    }, 3000);
    setSubmitting(false);
  } catch (error) {
    alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.');
    setSubmitting(false);
  }
};

  // Xử lý thay đổi form phản hồi
  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponseData({ ...responseData, [name]: value });
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  // Định dạng ngày
 const formatDate = (date) => {
  if (!date) return '';
  if (Array.isArray(date)) {
    // [2025, 6, 28] => "28/06/2025"
    const [y, m, d] = date;
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  }
  if (typeof date === 'string') {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  }
  return '';
};
const viewNotificationDetails = (notification) => {
  setActiveNotification(notification);
  if (notification.status === 'Chưa phản hồi') {
    setResponseData({
      campaignId: notification.id,
      response: '',
      note: ''
    });
  }
};
  // Đếm số thông báo mới
  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  return (
    <div className="parent-page vaccination-notifications-page">
      <div className="page-header">
        <h1>Thông báo tiêm chủng</h1>
        {newNotificationsCount > 0 && (
          <div className="new-notifications-badge">
            {newNotificationsCount} thông báo mới
          </div>
        )}
      </div>
      {responseSuccess && (
        <div className="success-message">
          <p>Phản hồi của bạn đã được gửi thành công!</p>
        </div>
      )}
      {loading ? (
        <div className="loading">Đang tải thông báo...</div>
      ) : (
        <div className="notifications-container">
          <div className="notifications-sidebar">
            <h2>Danh sách thông báo</h2>
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <p>Không có thông báo tiêm chủng nào</p>
              </div>
            ) : (
              <ul className="notifications-list">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${notification.isNew ? 'new' : ''} ${activeNotification?.id === notification.id ? 'active' : ''}`}
                    onClick={() => viewNotificationDetails(notification)}
                  >
                    <div className="notification-badge">
                      {notification.status === 'Chưa phản hồi' && <AlertTriangle size={16} className="pending" />}
                      {notification.status === 'Xác nhận' && <CheckCircle size={16} className="confirmed" />}
                      {notification.status === 'Từ chối' && <X size={16} className="declined" />}
                    </div>
                    <div className="notification-details">
                      <h3>{notification.title}</h3>
                      <div className="notification-meta">
                       <span className="date">{formatDate(notification.sentDate)}</span>
                        <span className={`status ${notification.status.toLowerCase().replace(' ', '-')}`}>
                          {notification.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="chevron-icon" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="notification-content">
            {!activeNotification ? (
              <div className="no-notification-selected">
                <div className="empty-state-icon">
                  <MessageCircle size={48} />
                </div>
                <h2>Chọn thông báo để xem chi tiết</h2>
                <p>Chọn một thông báo từ danh sách bên trái để xem chi tiết và phản hồi.</p>
              </div>
            ) : (
              <>
                <div className="notification-header">
                  <h2>{activeNotification.title}</h2>
                  <div className="notification-meta">
                    <span className="sent-date">
                      <Calendar size={14} />
                      Ngày gửi: {formatDate(activeNotification.sentDate)}
                    </span>
                    <span className={`status ${activeNotification.status.toLowerCase().replace(' ', '-')}`}>
                      {activeNotification.status === 'Chưa phản hồi' && <AlertTriangle size={14} />}
                      {activeNotification.status === 'Xác nhận' && <CheckCircle size={14} />}
                      {activeNotification.status === 'Từ chối' && <X size={14} />}
                      {activeNotification.status}
                    </span>
                  </div>
                </div>
                <div className="notification-body">
                  <div className="notification-info">
                    <div className="info-row">
                      <div className="info-group">
                        <label>Nhóm đối tượng:</label>
                        <span>{activeNotification.targetGroup}</span>
                      </div>
                      <div className="info-group">
                        <label>Loại Vắc Xin:</label>
                        <span>{activeNotification.type}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-group">
                        <label>Ngày tiêm:</label>
                        <span>{formatDate(activeNotification.date)}</span>
                      </div>
                      <div className="info-group">
                        <label>Địa điểm:</label>
                        <span>{activeNotification.address}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-group">
                        <label>Người tổ chức:</label>
                        <span>
                          {getOrganizerName(activeNotification.organizerId)}
                        </span>
                      </div>
                      <div className="info-group">
                        <label>Giấy tờ yêu cầu:</label>
                        <div className="document-list">
                          <FileText size={14} />
                          <span>{activeNotification.requiredDocuments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="info-row full">
                      <div className="info-group">
                        <label>Mô tả:</label>
                        <span>{activeNotification.description}</span>
                      </div>
                    </div>
                  </div>
                  {/* Show this if the user has already responded */}
                  {activeNotification.status !== 'Chưa phản hồi' && (
                    <div className="response-summary">
                      <h3>Phản hồi của bạn</h3>
                      <div className={`response-type ${activeNotification.status === 'Xác nhận' ? 'confirmed' : 'declined'}`}>
                        {activeNotification.status === 'Xác nhận' ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Đã xác nhận cho con tham gia tiêm chủng</span>
                          </>
                        ) : (
                          <>
                            <X size={16} />
                            <span>Đã từ chối cho con tham gia tiêm chủng</span>
                          </>
                        )}
                      </div>
                      {activeNotification.responseNote && (
                        <div className="response-note">
                          <h4>Ghi chú:</h4>
                          <p>{activeNotification.responseNote}</p>
                        </div>
                      )}
                      <div className="response-date">
                        Phản hồi vào ngày: {formatDate(activeNotification.responseDate)}
                      </div>
                      <button 
                        className="change-response-btn"
                        onClick={() => setShowResponseForm(true)}
                      >
                        Thay đổi phản hồi
                      </button>
                    </div>
                  )}
                  {/* Show response form if status is pending or user wants to change response */}
                  {(activeNotification.status === 'Chưa phản hồi' || showResponseForm) && (
                    <div className="response-form-container">
                      <h3>Phản hồi của phụ huynh</h3>
                      <form className="response-form" onSubmit={sendResponse}>
                        <div className="response-options">
                          <div className="response-option">
                            <input 
                              type="radio" 
                              id="confirm" 
                              name="response" 
                              value="confirm"
                              checked={responseData.response === 'confirm'}
                              onChange={handleResponseChange}
                            />
                            <label htmlFor="confirm" className="confirm-label">
                              <CheckCircle size={16} />
                              <span>Xác nhận cho con tham gia tiêm chủng</span>
                            </label>
                          </div>
                          <div className="response-option">
                            <input 
                              type="radio" 
                              id="decline" 
                              name="response" 
                              value="decline"
                              checked={responseData.response === 'decline'}
                              onChange={handleResponseChange}
                            />
                            <label htmlFor="decline" className="decline-label">
                              <X size={16} />
                              <span>Từ chối cho con tham gia tiêm chủng</span>
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="note">Ghi chú (không bắt buộc):</label>
                          <textarea
                            id="note"
                            name="note"
                            value={responseData.note}
                            onChange={handleResponseChange}
                            placeholder="Thông tin thêm hoặc lý do từ chối (nếu có)"
                            rows="3"
                          ></textarea>
                        </div>
                        <div className="form-actions">
                          {showResponseForm && (
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => setShowResponseForm(false)}
                            >
                              Hủy
                            </button>
                          )}
                          <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={submitting || !responseData.response}
                          >
                            {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default VaccinationNotifications;
