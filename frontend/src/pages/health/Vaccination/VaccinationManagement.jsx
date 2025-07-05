import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Input, Select, DatePicker, Space, Tag, Modal, Form, 
  Statistic, Row, Col, Avatar, Typography, Tooltip, message, Spin, Badge,
  Switch, Radio, Alert, Dropdown, Menu, Tabs
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, FileTextOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined,
  CalendarOutlined, MedicineBoxOutlined, UserOutlined, ExportOutlined,
  SearchOutlined, FilterOutlined, BellOutlined, TeamOutlined, MoreOutlined,
  EyeOutlined, SyncOutlined
} from '@ant-design/icons';
import "./VaccinationManagement.css";
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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
  { value: 'PENDING', label: 'Chờ phê duyệt', color: 'orange' },
  { value: 'APPROVED', label: 'Đã duyệt', color: 'green' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'red' }
];

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [notificationForm] = Form.useForm();
  
  // State management
  const [vaccinationEvents, setVaccinationEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedVaccineType, setSelectedVaccineType] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  
  // Modal states
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [currentStudentResponses, setCurrentStudentResponses] = useState([]);
  
  // User info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const isAdmin = user.userRole === 'ROLE_ADMIN';
  const isNurse = user.userRole === 'ROLE_NURSE';
  const canManageVaccination = isAdmin || isNurse;
  
  const getOrganizerName = (organizerId) => {
    if (!organizerId) return 'Không xác định';
    const user = users.find(u => u.id === organizerId || u.userId === organizerId);
    return user ? user.fullName || user.name : 'Không xác định';
  };

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
        key: item.id || idx,
        id: item.id || item.campaignId || idx + 1,
        title: item.campaignName || '',
        vaccineType: item.type || '',
        description: item.description || '',
        scheduledDate: item.scheduledDate || '',
        scheduledTime: item.scheduledTime || '09:00',
        location: item.location || 'Phòng y tế trường',
        targetClass: item.targetGroup || '',
        status: item.status || 'PENDING',
        notes: item.notes || '',
        vaccineBatch: item.vaccineBatch || '',
        manufacturer: item.manufacturer || '',
        doseAmount: item.doseAmount || '',
        organizer: item.organizer || item.approvedBy || '',
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
      console.log('Vaccination events fetched successfully:', mappedData);
    } catch (error) {
      message.error('Không thể tải danh sách chiến dịch tiêm chủng');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinationEvents();
  }, []);

  // Handle approval
  const handleApprove = async (record) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await VaccinationService.approveVaccinationCampaign(
        record.id,
        { status: 'APPROVED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đã duyệt chiến dịch thành công');
      fetchVaccinationEvents();
    } catch (error) {
      message.error('Có lỗi khi duyệt chiến dịch');
    } finally {
      setLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (record) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn từ chối chiến dịch "${record.title}"?`,
      okText: 'Từ chối',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          await VaccinationService.rejectVaccinationCampaign(
            record.id,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Đã từ chối chiến dịch thành công');
          fetchVaccinationEvents();
        } catch (error) {
          message.error('Có lỗi khi từ chối chiến dịch');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle delete
  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa chiến dịch "${record.title}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          // API call to delete
          message.success('Đã xóa chiến dịch thành công');
          fetchVaccinationEvents();
        } catch (error) {
          message.error('Có lỗi khi xóa chiến dịch');
        }
      }
    });
  };

  // Handle send notification
  const handleSendNotification = (record) => {
    setCurrentCampaign(record);
    notificationForm.setFieldsValue({
      subject: `Thông báo tiêm chủng: ${record.title}`,
      message: `Kính gửi Quý phụ huynh,\n\nNhà trường tổ chức chương trình tiêm chủng ${record.vaccineType} cho học sinh vào ngày ${dayjs(record.scheduledDate).format('DD/MM/YYYY')}.\n\nKính mong Quý phụ huynh xác nhận cho con tham gia chương trình này.\n\nTrân trọng,\nPhòng Y tế`,
      deadlineDate: dayjs().add(7, 'day'),
      sendToAll: true
    });
    setNotificationModalOpen(true);
  };

  // Handle view responses
  const handleViewResponses = (record) => {
    // Mock data for responses
    const mockResponses = [
      { 
        key: 1, 
        studentName: 'Nguyễn Văn A', 
        className: '10A1', 
        status: 'confirmed', 
        parentNote: 'Con đã tiêm đầy đủ', 
        responseDate: '2023-09-10' 
      },
      { 
        key: 2, 
        studentName: 'Trần Thị B', 
        className: '10A1', 
        status: 'declined', 
        parentNote: 'Con bị dị ứng với thành phần vắc-xin', 
        responseDate: '2023-09-11' 
      },
      { 
        key: 3, 
        studentName: 'Lê Văn C', 
        className: '10A2', 
        status: 'confirmed', 
        parentNote: '', 
        responseDate: '2023-09-12' 
      },
      { 
        key: 4, 
        studentName: 'Phạm Thị D', 
        className: '10A2', 
        status: 'pending', 
        parentNote: '', 
        responseDate: '' 
      }
    ];
    setCurrentStudentResponses(mockResponses);
    setCurrentCampaign(record);
    setResponseModalOpen(true);
  };

  // Filter events
  const filteredEvents = vaccinationEvents.filter(event => {
    let matchesTab = true;
    
    // Filter by tab status for admin and nurses
    if (canManageVaccination && activeTab !== 'ALL') {
      if (activeTab === 'APPROVED') {
        matchesTab = event.status === 'APPROVED';
      } else if (activeTab === 'PENDING') {
        matchesTab = event.status === 'PENDING';
      } else if (activeTab === 'CANCELLED') {
        matchesTab = event.status === 'CANCELLED';
      }
    } else if (!canManageVaccination) {
      // For other roles, show all events
      matchesTab = true;
    }
    
    const matchesSearch = !searchText || 
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.vaccineType.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !selectedStatus || event.status === selectedStatus;
    const matchesVaccineType = !selectedVaccineType || event.vaccineType === selectedVaccineType;
    let matchesDateRange = true;
    if (dateRange && dateRange.length === 2) {
      const eventDate = dayjs(event.scheduledDate);
      matchesDateRange = eventDate.isAfter(dateRange[0]) && eventDate.isBefore(dateRange[1]);
    }
    return matchesTab && matchesSearch && matchesStatus && matchesVaccineType && matchesDateRange;
  });

  // Table columns
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Loại vắc-xin',
      dataIndex: 'vaccineType',
      key: 'vaccineType',
      render: (text) => (
        <Tag icon={<MedicineBoxOutlined />} color="blue">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (text, record) => (
        <div>
          <CalendarOutlined style={{ color: '#52c41a', marginRight: 4 }} />
          {dayjs(text).format('DD/MM/YYYY')}
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.scheduledTime}
          </Text>
        </div>
      ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'targetClass',
      key: 'targetClass',
      render: (text) => (
        <Tag icon={<TeamOutlined />} color="purple">
          {text || 'Tất cả'}
        </Tag>
      ),
    },
    {
      title: 'Đơn vị tổ chức',
      dataIndex: 'organizer',
      key: 'organizer',
      render: (text) => (
        <div>
          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <Text>{(text)}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = statusOptions.find(s => s.value === status);
        const config = statusConfig || { label: status, color: 'default' };
        return (
          <Tag color={config.color} style={{ borderRadius: '12px' }}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Phản hồi',
      key: 'responses',
      render: (_, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
            <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
              {record.responses?.confirmed || 0}
            </Text>
            <Text>/</Text>
            <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
              {record.responses?.declined || 0}
            </Text>
            <Text>/</Text>
            <Text style={{ color: '#fa8c16', fontWeight: 'bold' }}>
              {record.responses?.pending || 0}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, fontSize: '10px' }}>
            <Text type="secondary">Đồng ý</Text>
            <Text type="secondary">/</Text>
            <Text type="secondary">Từ chối</Text>
            <Text type="secondary">/</Text>
            <Text type="secondary">Chờ</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Chỉnh sửa',
            onClick: () => navigate('/capnhatthongtintiemchung', { state: { event: record } })
          },
          {
            key: 'send',
            icon: <BellOutlined />,
            label: 'Gửi thông báo',
            onClick: () => handleSendNotification(record)
          },
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'Xem phản hồi',
            onClick: () => handleViewResponses(record)
          },
          
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Xóa',
            danger: true,
            onClick: () => handleDelete(record)
          }
        ];

        if (isAdmin && record.status === 'PENDING') {
          menuItems.unshift({
            key: 'approve',
            icon: <CheckCircleOutlined />,
            label: 'Duyệt chiến dịch',
            onClick: () => handleApprove(record)
          });
          menuItems.unshift({
            key: 'reject',
            icon: <CloseCircleOutlined />,
            label: 'Từ chối',
            danger: true,
            onClick: () => handleReject(record)
          });
        }

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  // Response table columns
  const responseColumns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          confirmed: { icon: <CheckCircleOutlined />, color: 'success', text: 'Xác nhận' },
          declined: { icon: <CloseCircleOutlined />, color: 'error', text: 'Từ chối' },
          pending: { icon: <ExclamationCircleOutlined />, color: 'warning', text: 'Chưa phản hồi' }
        };
        const { icon, color, text } = config[status] || config.pending;
        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Ghi chú phụ huynh',
      dataIndex: 'parentNote',
      key: 'parentNote',
      render: (note) => note || <Text type="secondary">Không có</Text>,
    },
    {
      title: 'Ngày phản hồi',
      dataIndex: 'responseDate',
      key: 'responseDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : <Text type="secondary">—</Text>,
    },
  ];

  return (
    <div className="vaccination-management-page">
      {/* Header */}
      <Card className="header-card">
        <div className="header-content">
          <Avatar size={64} icon={<MedicineBoxOutlined />} className="header-avatar" />
          <div className="header-text">
            <Title level={2} className="header-title">
              Quản lý tiêm chủng
            </Title>
            <Text className="header-description">
              Quản lý các chiến dịch tiêm chủng và theo dõi phản hồi từ phụ huynh
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="create-btn"
            onClick={() => navigate('/taosukientiemchung')}
          >
            Tạo chiến dịch mới
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Tổng chiến dịch"
              value={vaccinationEvents.length}
              prefix={<MedicineBoxOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Chờ phê duyệt"
              value={vaccinationEvents.filter(e => e.status === 'PENDING').length}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Đã duyệt"
              value={vaccinationEvents.filter(e => e.status === 'APPROVED').length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="Đã hủy"
              value={vaccinationEvents.filter(e => e.status === 'CANCELLED').length}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc loại vắc-xin..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: '100%' }}
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Select
              placeholder="Loại vắc-xin"
              value={selectedVaccineType}
              onChange={setSelectedVaccineType}
              allowClear
              style={{ width: '100%' }}
            >
              {vaccineTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={2}>
            <Button
              icon={<SyncOutlined />}
              onClick={fetchVaccinationEvents}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      {canManageVaccination && (
        <Card style={{ marginBottom: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              { key: 'APPROVED', label: 'Đã duyệt' },
              { key: 'PENDING', label: 'Chờ phê duyệt' },
              { key: 'CANCELLED', label: 'Đã hủy' }
            ]}
          />
        </Card>
      )}

      {/* Table */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredEvents}
          loading={loading}
          pagination={{
            total: filteredEvents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} chiến dịch`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Notification Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BellOutlined style={{ color: '#52c41a' }} />
            Gửi thông báo tiêm chủng
          </div>
        }
        open={notificationModalOpen}
        onCancel={() => setNotificationModalOpen(false)}
        footer={null}
        width={700}
        className="notification-modal"
      >
        <Form
          form={notificationForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              setLoading(true);
              // API call to send notification
              await new Promise(resolve => setTimeout(resolve, 1000));
              message.success('Đã gửi thông báo thành công');
              setNotificationModalOpen(false);
            } catch (error) {
              message.error('Có lỗi khi gửi thông báo');
            } finally {
              setLoading(false);
            }
          }}
        >
          <Alert
            message="Thông báo sẽ được gửi đến phụ huynh của học sinh thuộc đối tượng tiêm"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form.Item
            name="subject"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung thông báo" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deadlineDate"
                label="Hạn phản hồi"
                rules={[{ required: true, message: 'Vui lòng chọn hạn phản hồi' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sendToAll" label="Đối tượng gửi">
                <Radio.Group>
                  <Radio value={true}>Tất cả học sinh</Radio>
                  <Radio value={false}>Lớp cụ thể</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setNotificationModalOpen(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                Gửi thông báo
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Response Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ color: '#52c41a' }} />
            Phản hồi từ phụ huynh
          </div>
        }
        open={responseModalOpen}
        onCancel={() => setResponseModalOpen(false)}
        footer={[
          <Button key="export" icon={<ExportOutlined />}>
            Xuất danh sách
          </Button>,
          <Button key="close" onClick={() => setResponseModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={900}
        className="response-modal"
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="Tổng số"
              value={currentStudentResponses.length}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Xác nhận"
              value={currentStudentResponses.filter(r => r.status === 'confirmed').length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Từ chối"
              value={currentStudentResponses.filter(r => r.status === 'declined').length}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Chưa phản hồi"
              value={currentStudentResponses.filter(r => r.status === 'pending').length}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>

        <Table
          columns={responseColumns}
          dataSource={currentStudentResponses}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default VaccinationManagement;
