import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Badge,
  Button,
  Radio,
  Input,
  Spin,
  Empty,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Descriptions,
  Alert,
  Form,
  message,
  Divider,
  Avatar,
  Tooltip
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import vaccinationService from '../../../services/VaccinationService';
import "./VaccinationNotifications.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const VaccinationNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  
  // Helper function to determine parent confirmation status (same as StudentsWithVaccinationStatus)
  const getParentConfirmationStatus = (parentConfirmation, record) => {
    // First check if there are explicit confirmation indicators
    if (record?.isParentConfirm === true || record?.parentApproval === true || record?.confirmed === true) {
      return 'confirmed';
    }
    
    // Check if status field indicates confirmation
    if (record?.status === 'CONFIRMED' || record?.status === 'APPROVED' || record?.parentResponseStatus === 'CONFIRMED') {
      return 'confirmed';
    }
    
    // Handle strict boolean true - parent has confirmed
    if (parentConfirmation === true) {
      return 'confirmed';
    }
    
    // Check for explicit decline indicators first
    if (record?.isParentConfirm === false || record?.parentApproval === false || record?.status === 'DECLINED' || record?.parentResponseStatus === 'DECLINED') {
      return 'declined';
    }
    
    // Handle strict boolean false - could be declined or no record
    if (parentConfirmation === false) {
      // More specific check for "no record" vs "actually declined"
      // If there's no vaccination record at all (vaccinationId is 0 or null) AND no explicit response date/note,
      // then it's likely a "no record" case
      const hasNoVaccinationRecord = !record || record.vaccinationId === 0 || record.vaccinationId === null;
      const hasNoResponseData = !record?.responseDate && !record?.notes && !record?.parentResponseDate;
      const isResultPending = record?.result === 'PENDING' || !record?.result;
      
      // If it's clearly a "no vaccination record" case, treat as pending
      if (hasNoVaccinationRecord && hasNoResponseData && isResultPending) {
        return 'pending';
      } else {
        // Otherwise, false means explicitly declined
        return 'declined';
      }
    } 
    
    // null, undefined, or any other value means pending
    return 'pending';
  };
  const [responseData, setResponseData] = useState({
    campaignId: null,
    response: '',
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [form] = Form.useForm();

  const token = localStorage.getItem('token');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser?.userRole;

  // Hàm lấy tên người tổ chức
  const getOrganizerName = (organizer) => {
    if (!organizer) return 'Chưa xác định';
    
    // If organizer is already a text name (not a number), return it directly
    if (typeof organizer === 'string' && isNaN(Number(organizer))) {
      // Clean up empty strings
      const cleanedOrganizer = organizer.trim();
      return cleanedOrganizer || 'Không xác định';
    }
    
    // If it's a number/ID, try to find user in users array
    const userId = Number(organizer);
    const user = users.find(u => 
      u.id === userId || 
      String(u.id) === String(userId) ||
      u.userId === userId ||
      String(u.userId) === String(userId)
    );
    
    if (user) {
      return user.fullName || user.name || 'Tên không có';
    }
    
    // Known organizer mappings based on actual data
    const organizerMappings = {
      '3': 'Quản trị viên hệ thống',
      '36': 'Y tế trường học',
      // Add more mappings as needed
    };
    
    const organizerName = organizerMappings[String(userId)];
    if (organizerName) {
      return organizerName;
    }
    
    // Generic fallback for any missing user
    return `Cán bộ y tế (ID: ${userId})`;
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
    


    const response = await vaccinationService.getVaccinationCampaignApproved(config);
    const data = Array.isArray(response.data) ? response.data : [];

    
    // Lọc chiến dịch phù hợp với lớp học sinh
    function removeVietnameseTones(str) {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    

    
    const filtered = data.filter(item => {

      
      if (!studentClass || !item.targetGroup) {

        return false;
      }
      
      const target = item.targetGroup.toLowerCase().trim();
      const studentClassLower = studentClass.toLowerCase().trim();
      const targetNoSign = removeVietnameseTones(target).replace(/\s/g, '');
      const studentClassNoSign = removeVietnameseTones(studentClassLower).replace(/\s/g, '');
      

      

      // Toàn trường - matches all students
      if (targetNoSign === 'toantruong') {
        return true;
      }

      // Exact class match (e.g., "1a" matches "1A")
      if (targetNoSign === studentClassNoSign) {
        return true;
      }

      // Extract grade number from student class (e.g., "3A" -> "3", "1B" -> "1")
      const studentGradeMatch = studentClassNoSign.match(/^(\d+)/);
      const studentGrade = studentGradeMatch ? studentGradeMatch[1] : null;

      // Handle "khối X" format in target (e.g., "khối 4", "khoi 4")
      const khoiMatch = targetNoSign.match(/khoi(\d+)/);
      if (khoiMatch && studentGrade === khoiMatch[1]) {
        return true;
      }

      // Handle simple grade numbers (e.g., "1", "2", "3")
      if (targetNoSign.match(/^\d+$/) && studentGrade === targetNoSign) {
        return true;
      }

      // Handle comma-separated targets (e.g., "1,2,3", "khối 1,2", "1a,1b")
      if (targetNoSign.includes(',')) {
        const targetParts = targetNoSign.split(',').map(part => part.trim());
        
        for (const part of targetParts) {
          // Check exact class match
          if (part === studentClassNoSign) {
            return true;
          }
          
          // Check simple grade number
          if (part.match(/^\d+$/) && studentGrade === part) {
            return true;
          }
          
          // Check "khoi X" format
          const partKhoiMatch = part.match(/khoi(\d+)/);
          if (partKhoiMatch && studentGrade === partKhoiMatch[1]) {
            return true;
          }
        }
      }

      // Partial matching - target contains class or vice versa
      if (targetNoSign.includes(studentClassNoSign) || studentClassNoSign.includes(targetNoSign)) {
        return true;
      }

      return false;
    });
    


    const mapped = await Promise.all(filtered.map(async item => {
      let status = 'Chưa phản hồi';
      let responseNote = '';
      let responseDate = '';
      
      try {
        // Get specific student's vaccination status for this campaign
        const studentId = localStorage.getItem('selectedStudentId');
        if (studentId) {
          const statusResponse = await vaccinationService.getStudentsWithVaccinationStatus(item.campaignId, config);
          const studentData = Array.isArray(statusResponse.data) 
            ? statusResponse.data.find(student => String(student.studentId) === String(studentId))
            : null;
          
          if (studentData) {
            // Use the helper function to determine status
            const statusResult = getParentConfirmationStatus(studentData.parentConfirmation, studentData);
            
            switch (statusResult) {
              case 'confirmed':
                status = 'Xác nhận';
                break;
              case 'declined':
                status = 'Từ chối';
                break;
              case 'pending':
              default:
                status = 'Chưa phản hồi';
                break;
            }
            
            responseNote = studentData.notes || '';
            responseDate = studentData.vaccinationDate || '';
          }
        }
      } catch (error) {

        // Keep default status as 'Chưa phản hồi'
      }
      
      return {
        id: item.campaignId,
        title: `Thông báo tiêm chủng: ${item.campaignName}`,
        campaignName: item.campaignName,
        targetGroup: item.targetGroup,
        type: item.type,
        address: item.address,
        // Use organizer field as the primary organizer name
        organizerId: item.organizer || item.approvedBy || item.createdBy || item.organizerId || item.userId,
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
    }));
    
    setNotifications(mapped);
    setLoading(false);
  } catch (error) {
    setNotifications([]);
    setLoading(false);
  }
};
// Gửi phản hồi xác nhận/từ chối (gọi API thực tế)
const sendResponse = async (values) => {
  if (!values.response) {
    message.error('Vui lòng chọn phản hồi của bạn');
    return;
  }
  setSubmitting(true);
  try {
    // Lấy studentId từ localStorage
    const studentId = localStorage.getItem('selectedStudentId');
    if (!studentId) {
      message.error('Vui lòng chọn học sinh trước khi phản hồi!');
      setSubmitting(false);
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    // Nếu xác nhận thì gọi API đăng ký tiêm chủng
    if (values.response === 'confirm')  {
      // Đúng thứ tự: campaignId, studentId, config
      await vaccinationService.parentApproveCampaign(
        activeNotification.id,
        Number(studentId),
        config
      );
    }
    if( values.response === 'decline') {
      // Gọi API từ chối tiêm chủng
      await vaccinationService.parentRejectCampaign(
        activeNotification.id,
        Number(studentId),
        config
      );
    }
    // Nếu từ chối thì có thể gọi API khác nếu backend hỗ trợ, hoặc chỉ cập nhật UI

    setNotifications(notifications.map(notification => {
      if (notification.id === activeNotification.id) {
        return {
          ...notification,
          status: values.response === 'confirm' ? 'Xác nhận' : 'Từ chối',
          responseNote: values.note || '',
          responseDate: new Date().toISOString().split('T')[0],
          isNew: false
        };
      }
      return notification;
    }));
    if (activeNotification) {
      setActiveNotification({
        ...activeNotification,
        status: values.response === 'confirm' ? 'Xác nhận' : 'Từ chối',
        responseNote: values.note || '',
        responseDate: new Date().toISOString().split('T')[0],
        isNew: false
      });
    }
    message.success('Phản hồi của bạn đã được gửi thành công!');
    form.resetFields();
    setSubmitting(false);
  } catch (error) {
    message.error('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.');
    setSubmitting(false);
  }
};

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Chưa phản hồi':
        return { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Chờ phản hồi' };
      case 'Xác nhận':
        return { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã xác nhận' };
      case 'Từ chối':
        return { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã từ chối' };
      default:
        return { color: 'default', icon: null, text: status };
    }
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
  form.resetFields();
  // Reset response data when viewing notification
  setResponseData({
    campaignId: notification.id,
    response: '',
    note: ''
  });
};

// Handle quick response with prominent buttons
const handleQuickResponse = async (responseType) => {
  if (!activeNotification) return;
  
  // Set the response type in state
  setResponseData(prev => ({ ...prev, response: responseType }));
  
  // Immediately send the response
  await sendResponse({ 
    response: responseType, 
    note: responseData.note 
  });
};
  // Đếm số thông báo mới
  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  return (
    <div className="vaccination-notifications-page">
      {/* Header */}
      <Card className="header-card">
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="large">
              <Avatar 
                size={48} 
                icon={<BellOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                  Thông báo tiêm chủng
                </Title>
                <Text type="secondary">
                  Quản lý và phản hồi các thông báo tiêm chủng của con em
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            {newNotificationsCount > 0 && (
              <Badge count={newNotificationsCount} style={{ backgroundColor: '#ff4d4f' }}>
                <Button type="primary" size="large" icon={<BellOutlined />}>
                  Thông báo mới
                </Button>
              </Badge>
            )}
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Sidebar - Notifications List */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BellOutlined style={{ color: '#1890ff' }} />
                <span>Danh sách thông báo</span>
                <Badge count={notifications.length} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
            bodyStyle={{ padding: 0 }}
            style={{ height: '600px', overflow: 'hidden' }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải thông báo...</div>
              </div>
            ) : notifications.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có thông báo tiêm chủng nào"
                style={{ padding: '50px 20px' }}
              />
            ) : (
<List
                dataSource={notifications}
                style={{ height: '540px', overflow: 'auto' }}
                renderItem={(notification) => {
                  const statusConfig = getStatusConfig(notification.status);
                  return (
                    <List.Item 
                      className={`notification-item ${
                        activeNotification?.id === notification.id ? 'active' : ''
                      }`}
                      onClick={() => viewNotificationDetails(notification)}
                      style={{
                        cursor: 'pointer',
                        padding: '16px 20px',
                        borderLeft: activeNotification?.id === notification.id 
                          ? '4px solid #1890ff' 
                          : '4px solid transparent',
                        backgroundColor: activeNotification?.id === notification.id 
                          ? '#f0f9ff' 
                          : 'white'
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge dot={notification.isNew} color="red">
                            <Avatar 
                              icon={<MedicineBoxOutlined />}
                              style={{ backgroundColor: statusConfig.color === 'orange' ? '#fa8c16' : statusConfig.color === 'green' ? '#52c41a' : '#ff4d4f' }}
                            />
                          </Badge>
                        }
                        title={
                          <div>
                            <Text strong ellipsis style={{ fontSize: '14px' }}>
                              {notification.title}
                            </Text>
                          </div>
                        }
                        description={
                          <Space direction="vertical" size={4} style={{ width: '100%' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <CalendarOutlined /> {formatDate(notification.sentDate)}
                            </Text>
                            <Tag 
                              icon={statusConfig.icon} 
                              color={statusConfig.color}
                              style={{ fontSize: '11px' }}
                            >
                              {statusConfig.text}
                            </Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card style={{ height: '600px', overflow: 'auto' }}>
            {!activeNotification ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_DEFAULT}
description={
                  <div>
                    <Title level={4}>Chọn thông báo để xem chi tiết</Title>
                    <Text type="secondary">
                      Chọn một thông báo từ danh sách bên trái để xem chi tiết và phản hồi.
                    </Text>
                  </div>
                }
                style={{ padding: '80px 0' }}
              />
            ) : (
              <div>
                {/* Notification Header */}
                <div style={{ marginBottom: 24 }}>
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                      {activeNotification.title}
                    </Title>
                    <Space size={16}>
                      <Text type="secondary">
                        <CalendarOutlined /> Ngày gửi: {formatDate(activeNotification.sentDate)}
                      </Text>
                      <Tag 
                        icon={getStatusConfig(activeNotification.status).icon}
                        color={getStatusConfig(activeNotification.status).color}
                      >
                        {getStatusConfig(activeNotification.status).text}
                      </Tag>
                    </Space>
                  </Space>
                </div>

                <Divider />

                {/* Notification Details */}
                <Descriptions 
                  title="Thông tin chi tiết"
                  bordered
                  column={{ xs: 1, sm: 2 }}
                  style={{ marginBottom: 24 }}
                >
                  <Descriptions.Item 
                    label={<span><UserOutlined /> Nhóm đối tượng</span>}
                  >
                    <Tag color="blue">{activeNotification.targetGroup}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><MedicineBoxOutlined /> Loại vắc-xin</span>}
                  >
                    <Tag color="green">{activeNotification.type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><CalendarOutlined /> Ngày tiêm</span>}
                  >
                    {formatDate(activeNotification.date)}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><EnvironmentOutlined /> Địa điểm</span>}
                  >
                    {activeNotification.address}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<span><UserOutlined /> Người tổ chức</span>}
                  >
                    {getOrganizerName(activeNotification.organizerId)}
                  </Descriptions.Item>
                  <Descriptions.Item
label={<span><FileTextOutlined /> Giấy tờ yêu cầu</span>}
                  >
                    {activeNotification.requiredDocuments}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label="Mô tả" 
                    span={2}
                  >
                    <Paragraph>{activeNotification.description}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>

                {/* Response Summary */}
                {activeNotification.status !== 'Chưa phản hồi' && (
                  <Alert
                    message="Phản hồi của bạn"
                    description={
                      <div>
                        <Space direction="vertical" size={8}>
                          <Text strong>
                            {activeNotification.status === 'Xác nhận' ? (
                              <span style={{ color: '#52c41a' }}>
                                <CheckCircleOutlined /> Đã xác nhận cho con tham gia tiêm chủng
                              </span>
                            ) : (
                              <span style={{ color: '#ff4d4f' }}>
                                <CloseCircleOutlined /> Đã từ chối cho con tham gia tiêm chủng
                              </span>
                            )}
                          </Text>
                          {activeNotification.responseNote && (
                            <div>
                              <Text strong>Ghi chú: </Text>
                              <Text>{activeNotification.responseNote}</Text>
                            </div>
                          )}
                          <Text type="secondary">
                            Phản hồi vào ngày: {formatDate(activeNotification.responseDate)}
                          </Text>
                        </Space>
                        {/* Không cho phép thay đổi phản hồi sau khi đã có quyết định */}
                        {activeNotification.status === 'Xác nhận' && (
                          <Text type="secondary" style={{ marginTop: 8, display: 'block', fontStyle: 'italic' }}>
                            Không thể thay đổi sau khi đã xác nhận tham gia
                          </Text>
                        )}
                        {activeNotification.status === 'Từ chối' && (
                          <Text type="secondary" style={{ marginTop: 8, display: 'block', fontStyle: 'italic' }}>
                            Không thể thay đổi sau khi đã từ chối tham gia
                          </Text>
                        )}
                      </div>
                    }
                    type={activeNotification.status === 'Xác nhận' ? 'success' : 'error'}
                    style={{ marginBottom: 24 }}
                  />
                )}

                {/* Response Form - Only show if no response yet */}
                {activeNotification.status === 'Chưa phản hồi' && (
                  <Card 
                    title={
                      <Space>
                        <BellOutlined style={{ color: '#1890ff' }} />
                        <span>Phản hồi của phụ huynh</span>
                      </Space>
                    }
                    style={{ backgroundColor: '#fafafa' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Title level={4} style={{ marginBottom: 24, color: '#1890ff' }}>
                        Vui lòng chọn quyết định của bạn:
                      </Title>
                      
                      {/* Action Selection Buttons */}
                      <Space direction="vertical" size={16} style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
                        <Button
                          type={responseData.response === 'confirm' ? 'primary' : 'default'}
                          size="large"
                          icon={<CheckCircleOutlined />}
                          onClick={() => setResponseData({ ...responseData, response: 'confirm' })}
                          style={{
                            width: '100%',
                            height: '80px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: responseData.response === 'confirm' ? '#52c41a' : '#f0f0f0',
                            borderColor: responseData.response === 'confirm' ? '#52c41a' : '#d9d9d9',
                            color: responseData.response === 'confirm' ? 'white' : '#595959',
                            borderRadius: '12px',
                            boxShadow: responseData.response === 'confirm' ? '0 4px 12px rgba(82, 196, 26, 0.3)' : 'none'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '18px' }}>✓ Xác nhận cho con tham gia tiêm chủng</div>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: 4 }}>
                              Con tôi sẽ tham gia chương trình tiêm chủng này
                            </div>
                          </div>
                        </Button>
                        
                        <Button
                          type={responseData.response === 'decline' ? 'primary' : 'default'}
                          size="large"
                          icon={<CloseCircleOutlined />}
                          onClick={() => setResponseData({ ...responseData, response: 'decline' })}
                          style={{
                            width: '100%',
                            height: '80px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: responseData.response === 'decline' ? '#ff4d4f' : '#f0f0f0',
                            borderColor: responseData.response === 'decline' ? '#ff4d4f' : '#d9d9d9',
                            color: responseData.response === 'decline' ? 'white' : '#595959',
                            borderRadius: '12px',
                            boxShadow: responseData.response === 'decline' ? '0 4px 12px rgba(255, 77, 79, 0.3)' : 'none',
                            border: responseData.response === 'decline' ? '2px solid #ff4d4f' : '2px solid #d9d9d9'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '18px' }}>✗ Từ chối cho con tham gia tiêm chủng</div>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: 4 }}>
                              Con tôi sẽ không tham gia chương trình tiêm chủng này
                            </div>
                          </div>
                        </Button>
                      </Space>
                      
                      {/* Note Section - Show after selection */}
                      {responseData.response && (
                        <div style={{ marginTop: 24, textAlign: 'left' }}>
                          <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Ghi chú {responseData.response === 'decline' ? '(lý do từ chối)' : '(không bắt buộc)'}:
                          </Text>
                          <TextArea
                            value={responseData.note}
                            onChange={(e) => setResponseData({ ...responseData, note: e.target.value })}
                            placeholder={
                              responseData.response === 'decline' 
                                ? "Vui lòng cho biết lý do từ chối tiêm chủng..."
                                : "Thông tin thêm hoặc ghi chú (nếu có)..."
                            }
                            rows={4}
                            style={{ borderRadius: '8px', marginBottom: 16 }}
                          />
                        </div>
                      )}
                      
                      {/* Submit and Cancel Buttons */}
                      {responseData.response && (
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                          <Space size={16}>
                            <Button 
                              onClick={() => {
                                setResponseData({ campaignId: activeNotification.id, response: '', note: '' });
                              }}
                              style={{ borderRadius: '8px', minWidth: '100px' }}
                            >
                              Hủy bỏ
                            </Button>
                            <Button 
                              type="primary"
                              size="large"
                              loading={submitting}
                              onClick={() => sendResponse({ response: responseData.response, note: responseData.note })}
                              style={{ 
                                borderRadius: '8px', 
                                minWidth: '120px',
                                backgroundColor: responseData.response === 'confirm' ? '#52c41a' : '#ff4d4f',
                                borderColor: responseData.response === 'confirm' ? '#52c41a' : '#ff4d4f'
                              }}
                            >
                              {submitting ? 'Đang gửi...' : (
                                responseData.response === 'confirm' ? 'Xác nhận tham gia' : 'Xác nhận từ chối'
                              )}
                            </Button>
                          </Space>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default VaccinationNotifications;