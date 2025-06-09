import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, ChevronRight, Calendar, FileText, MessageCircle } from 'lucide-react';
import "./VaccinationNotifications.css";


const VaccinationNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseData, setResponseData] = useState({
    notificationId: null,
    response: '',
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);

  // Fetch vaccination notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // API call would go here
      // const response = await fetch('api/vaccination-notifications/parent');
      // const data = await response.json();
      
      // Mock data for now
      const mockData = [
        {
          id: 1,
          title: 'Thông báo tiêm chủng: Tiêm phòng cúm học kỳ 1',
          vaccineName: 'Vắc-xin cúm',
          date: '2023-09-15',
          time: '09:00 - 11:30',
          location: 'Phòng y tế trường',
          studentName: 'Nguyễn Văn An',
          studentClass: '10A1',
          description: 'Kính gửi Quý phụ huynh,\n\nNhà trường tổ chức chương trình tiêm chủng Cúm cho học sinh vào ngày 15/09/2023.\n\nKính mong Quý phụ huynh xác nhận cho con tham gia chương trình này.\n\nTrân trọng,\nPhòng Y tế',
          requiredDocuments: 'Phiếu đồng ý của phụ huynh, sổ tiêm chủng',
          status: 'Chưa phản hồi',
          responseDeadline: '2023-09-10',
          responseNote: '',
          isNew: true,
          sentDate: '2023-09-01'
        },
        {
          id: 2,
          title: 'Thông báo tiêm chủng: Tiêm vắc xin HPV cho học sinh nữ',
          vaccineName: 'Vắc-xin HPV',
          date: '2023-10-20',
          time: '13:30 - 16:00',
          location: 'Phòng y tế trường',
          studentName: 'Nguyễn Thị Lan',
          studentClass: '10A2',
          description: 'Kính gửi Quý phụ huynh,\n\nNhà trường tổ chức chương trình tiêm chủng HPV cho học sinh nữ lớp 10 vào ngày 20/10/2023.\n\nĐây là mũi tiêm thứ nhất trong quy trình 3 mũi. Chương trình được tài trợ bởi Sở Y tế thành phố.\n\nKính mong Quý phụ huynh xác nhận cho con tham gia chương trình này.\n\nTrân trọng,\nPhòng Y tế',
          requiredDocuments: 'Phiếu đồng ý của phụ huynh, giấy khám sức khỏe',
          status: 'Xác nhận',
          responseDeadline: '2023-10-15',
          responseNote: 'Con tôi đã tiêm đủ liều vaccine HPV trước đó',
          isNew: false,
          sentDate: '2023-10-02',
          responseDate: '2023-10-05'
        },
        {
          id: 3,
          title: 'Thông báo tiêm chủng: Tiêm nhắc Covid-19',
          vaccineName: 'Vắc-xin Covid-19',
          date: '2023-11-05',
          time: '08:30 - 11:00',
          location: 'Hội trường trường',
          studentName: 'Nguyễn Văn An',
          studentClass: '10A1',
          description: 'Kính gửi Quý phụ huynh,\n\nNhà trường tổ chức tiêm mũi nhắc vắc xin Covid-19 cho học sinh vào ngày 05/11/2023.\n\nChương trình tiêm chủng này là tự nguyện và miễn phí.\n\nKính mong Quý phụ huynh xác nhận cho con tham gia chương trình này.\n\nTrân trọng,\nPhòng Y tế',
          requiredDocuments: 'Phiếu đồng ý của phụ huynh, giấy xác nhận tiêm mũi trước đó',
          status: 'Từ chối',
          responseDeadline: '2023-10-30',
          responseNote: 'Con tôi có tiền sử dị ứng với thành phần vắc-xin',
          isNew: false,
          sentDate: '2023-10-10',
          responseDate: '2023-10-12'
        }
      ];
      
      setNotifications(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vaccination notifications:', error);
      setNotifications([]);
      setLoading(false);
    }
  };

  // Send response to vaccination notification
  const sendResponse = async (e) => {
    e.preventDefault();
    
    if (!responseData.response) {
      alert('Vui lòng chọn phản hồi của bạn');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // API call would go here
      // const response = await fetch(`api/vaccination-notifications/${responseData.notificationId}/response`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     response: responseData.response,
      //     note: responseData.note
      //   })
      // });
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect response
      setNotifications(notifications.map(notification => {
        if (notification.id === responseData.notificationId) {
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
      
      // If this was the active notification, update it
      if (activeNotification && activeNotification.id === responseData.notificationId) {
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
      
      // Reset response form
      setResponseData({
        notificationId: null,
        response: '',
        note: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setResponseSuccess(false);
      }, 3000);
      
      setSubmitting(false);
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.');
      setSubmitting(false);
    }
  };

  // View notification details
  const viewNotificationDetails = (notification) => {
    setActiveNotification(notification);
    
    // If notification is pending, set up response form data
    if (notification.status === 'Chưa phản hồi') {
      setResponseData({
        notificationId: notification.id,
        response: '',
        note: ''
      });
    }
  };

  // Handle response form changes
  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponseData({ ...responseData, [name]: value });
  };

  // Initialize component
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Count number of new notifications
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
                        <label>Học sinh:</label>
                        <span>{activeNotification.studentName}</span>
                      </div>
                      <div className="info-group">
                        <label>Lớp:</label>
                        <span>{activeNotification.studentClass}</span>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-group">
                        <label>Loại vắc-xin:</label>
                        <span>{activeNotification.vaccineName}</span>
                      </div>
                      <div className="info-group">
                        <label>Ngày tiêm:</label>
                        <span>{formatDate(activeNotification.date)}</span>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-group">
                        <label>Thời gian:</label>
                        <span>{activeNotification.time}</span>
                      </div>
                      <div className="info-group">
                        <label>Địa điểm:</label>
                        <span>{activeNotification.location}</span>
                      </div>
                    </div>
                    
                    <div className="info-row full">
                      <div className="info-group documents">
                        <label>Giấy tờ yêu cầu:</label>
                        <div className="document-list">
                          <FileText size={14} />
                          <span>{activeNotification.requiredDocuments}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="deadline-info">
                      <AlertTriangle size={14} />
                      <span>Hạn phản hồi: <strong>{formatDate(activeNotification.responseDeadline)}</strong></span>
                    </div>
                  </div>
                  
                  <div className="notification-message">
                    <h3>Thông báo từ nhà trường</h3>
                    <div className="message-content">
                      {activeNotification.description.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
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