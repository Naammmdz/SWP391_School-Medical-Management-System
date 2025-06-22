import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, ChevronRight, Calendar, FileText, MessageCircle } from 'lucide-react';
import vaccinationService from '../../../services/VaccinationService';
import "./VaccinationNotifications.css";

const VaccinationNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseData, setResponseData] = useState({
    campaignId: null,
    response: '',
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Hàm lấy tên người tổ chức từ id
  const getOrganizerName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Không xác định';
  };

  // Lấy danh sách chiến dịch tiêm chủng đã duyệt
const fetchNotifications = async () => {
  setLoading(true);
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const studentId = localStorage.getItem('selectedStudentId');
    // Lấy thông tin học sinh từ localStorage (giả sử đã lưu object student)
    const studentInfo = JSON.parse(localStorage.getItem('selectedStudentInfo') || '{}');
    const studentClass = studentInfo.className || ""; // ví dụ: "3A"
    console.log('Lớp học sinh:', studentClass);

    const response = await vaccinationService.getVaccinationCampaignApproved(config);
    const data = Array.isArray(response.data) ? response.data : [];

    // Lọc chiến dịch phù hợp với lớp học sinh
    const filtered = data.filter(item => {
      if (!studentClass || !item.targetGroup) return false;
      const target = item.targetGroup.toLowerCase();
      const studentClassLower = studentClass.toLowerCase();

      // So sánh chính xác hoặc kiểm tra từ khóa (ví dụ: "khối 3" khớp "3A")
      if (target === studentClassLower) return true;
      // Nếu target là "khối 3", kiểm tra studentClass có bắt đầu bằng "3"
      const khoiMatch = target.match(/khoi\s*(\d+)/);
      if (khoiMatch && studentClassLower.startsWith(khoiMatch[1])) return true;
      // Nếu target là "lớp 3A", kiểm tra trùng khớp
      if (target.includes(studentClassLower)) return true;
      // Nếu target là "3A", kiểm tra trùng khớp
      if (studentClassLower.includes(target)) return true;
      return false;
    });

    const mapped = filtered.map(item => {
      let status = 'Chưa phản hồi';
      let responseNote = '';
      let responseDate = '';
      if (item.responses && studentId) {
        const studentRes = item.responses.find(r => String(r.studentId) === String(studentId));
        if (studentRes) {
          if (studentRes.status === 'CONFIRMED') status = 'Xác nhận';
          if (studentRes.status === 'REJECTED') status = 'Từ chối';
          responseNote = studentRes.note || '';
          responseDate = studentRes.responseDate || '';
        }
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
        date: item.scheduledDate,
        status,
        isNew: status === 'Chưa phản hồi',
        sentDate: item.createdAt ? item.createdAt.split('T')[0] : '',
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
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
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