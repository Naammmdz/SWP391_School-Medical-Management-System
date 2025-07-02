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
  const [showResponseForm, setShowResponseForm] = useState(false);
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
   console.log('Dữ liệu chiến dịch tiêm chủng:', data);
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
      console.log('parentConfirm value:', item.isParentConfirm); // Debug log for parentConfirm specifically
      
      if (item.isParentConfirm !== undefined) {
        // Sử dụng parentConfirm từ API response để xác định trạng thái
        if (item.isParentConfirm === null) {
          status = 'Chưa phản hồi';
          console.log('Status set to: Chưa phản hồi (parentConfirm is null)');
        } else if (item.isParentConfirm === 'Đã đồng ý') {
          status = 'Xác nhận';
          console.log('Status set to: Xác nhận (parentConfirm is true)');
        } else if (item.isParentConfirm === 'Đã từ chối') {
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
      // Xem dữ liệu trước khi gửi
      console.log('Gửi đăng ký tiêm chủng:', {
        campaignId: activeNotification.id,
        studentId: Number(studentId),
        config
      });
      // Đúng thứ tự: campaignId, studentId, config
      await vaccinationService.parentApproveCampaign(
        activeNotification.id,
        Number(studentId),
        config
      );
    }
    if( values.response === 'decline') {
       console.log('Gửi từ chối tiêm chủng:', {
        campaignId: activeNotification.id,
        studentId: Number(studentId),
        config
      });
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
    if (activeNotification && activeNotification.id === activeNotification.id) {
      setActiveNotification({
        ...activeNotification,
        status: values.response === 'confirm' ? 'Xác nhận' : 'Từ chối',
        responseNote: values.note || '',
        responseDate: new Date().toISOString().split('T')[0],
        isNew: false
      });
    }
    setShowResponseForm(false);
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
  setShowResponseForm(false);
  form.resetFields();
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
                        <Button 
                          type="link" 
                          onClick={() => setShowResponseForm(true)}
                          style={{ padding: 0, marginTop: 8 }}
                        >
                          Thay đổi phản hồi
                        </Button>
                      </div>
                    }
                    type={activeNotification.status === 'Xác nhận' ? 'success' : 'error'}
                    style={{ marginBottom: 24 }}
                  />
                )}

                {/* Response Form */}
                {(activeNotification.status === 'Chưa phản hồi' || showResponseForm) && (
                  <Card 
                    title={
                      <Space>
                        <BellOutlined style={{ color: '#1890ff' }} />
                        <span>Phản hồi của phụ huynh</span>
                      </Space>
                    }
                    style={{ backgroundColor: '#fafafa' }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={sendResponse}
                    >
                      <Form.Item
                        name="response"
                        label="Quyết định của bạn"
                        rules={[{ required: true, message: 'Vui lòng chọn phản hồi!' }]}
                      >
                        <Radio.Group size="large">
                          <Space direction="vertical" size={12}>
                            <Radio.Button 
                              value="confirm" 
                              style={{ 
                                width: '100%', 
                                height: 'auto', 
                                padding: '12px 16px',
                                border: '2px solid #52c41a',
                                color: '#52c41a'
                              }}
                            >
                              <Space>
                                <CheckCircleOutlined />
                                <span>Xác nhận cho con tham gia tiêm chủng</span>
                              </Space>
                            </Radio.Button>
                            <Radio.Button 
                              value="decline"
                              style={{ 
                                width: '100%', 
                                height: 'auto', 
                                padding: '12px 16px',
                                border: '2px solid #ff4d4f',
                                color: '#ff4d4f'
                              }}
                            >
                              <Space>
                                <CloseCircleOutlined />
                                <span>Từ chối cho con tham gia tiêm chủng</span>
                              </Space>
                            </Radio.Button>
                          </Space>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        name="note"
                        label="Ghi chú (không bắt buộc)"
                      >
                        <TextArea
                          placeholder="Thông tin thêm hoặc lý do từ chối (nếu có)"
                          rows={3}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Space>
                          {showResponseForm && (
                            <Button onClick={() => setShowResponseForm(false)}>
                              Hủy
                            </Button>
                          )}
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={submitting}
                            size="large"
                          >
                            {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                          </Button>
                        </Space>
                      </Form.Item>
                    </Form>
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
