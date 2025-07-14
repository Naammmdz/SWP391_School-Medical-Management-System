import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Input, Select, DatePicker, Space, Tag, Modal, Form, 
  Statistic, Row, Col, Avatar, Typography, Tooltip, message, Spin, Badge,
  Switch, Radio, Alert, Dropdown, Menu, Tabs, Divider
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
import AllStudentsInCampaign from '../../../components/vaccination/AllStudentsInCampaign';
import StudentsWithVaccinationStatus from '../../../components/vaccination/StudentsWithVaccinationStatus';
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
  const [modal, contextHolder] = Modal.useModal();
  
  // State management
  const [vaccinationEvents, setVaccinationEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedVaccineType, setSelectedVaccineType] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  
  // Modal states
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  // Thêm state cho modal hủy
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  
  // User info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const isAdmin = user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRINCIPAL';
  
  const getOrganizerName = (organizerId, record) => {
    // Use organizer field from backend response
    const organizer = organizerId || record?.organizer;
    
    if (!organizer) {
      return 'Không xác định';
    }
    
    // If organizer is already a string (organization name), return it
    if (typeof organizer === 'string' && organizer !== '' && !Number.isInteger(Number(organizer))) {
      return organizer;
    }
    
    // Try to find user by ID if it's a number
    const foundUser = users.find(u => 
      u.id === organizer || 
      u.userId === organizer || 
      u.id === Number(organizer) || 
      u.userId === Number(organizer)
    );
    
    return foundUser ? (foundUser.fullName || foundUser.name) : (organizer || 'Không xác định');
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
        key: item.campaignId || idx,
        id: item.campaignId || idx + 1,
        title: item.campaignName || '',
        vaccineType: item.type || '',
        description: item.description || '',
        scheduledDate: item.scheduledDate || '',
        scheduledTime: item.scheduledTime || '09:00',
        location: item.address || 'Phòng y tế trường',
        targetClass: item.targetGroup || '',
        status: item.status || 'PENDING',
        notes: item.notes || '',
        vaccineBatch: item.vaccineBatch || '',
        manufacturer: item.manufacturer || '',
        doseAmount: item.doseAmount || '',
        organizer: item.organizer || '',
        createdBy: item.createdBy || '',
        approvedBy: item.approvedBy || '',
        approvedAt: item.approvedAt || '',
        createdAt: item.createdAt || '',
        rejectionReason: item.rejectionReason || '',
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


  // Handle cancel
  const handleCancel = (record) => {
    setCancelTarget(record);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy chiến dịch!');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await VaccinationService.cancelVaccinationCampaign(
        cancelTarget.id,
        // Truyền rejectionReason dưới dạng query param
        { 
          params: { rejectionReason: cancelReason },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      message.success('Đã hủy chiến dịch thành công');
      setCancelModalOpen(false);
      fetchVaccinationEvents();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi hủy chiến dịch';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // Handle delete
  // const handleDelete = (record) => {
  //   Modal.confirm({
  //     title: 'Xác nhận xóa',
  //     content: `Bạn có chắc muốn xóa chiến dịch "${record.title}"?`,
  //     okText: 'Xóa',
  //     cancelText: 'Hủy',
  //     okType: 'danger',
  //     onOk: async () => {
  //       try {
  //         // API call to delete
  //         message.success('Đã xóa chiến dịch thành công');
  //         fetchVaccinationEvents();
  //       } catch (error) {
  //         message.error('Có lỗi khi xóa chiến dịch');
  //       }
  //     }
  //   });
  // };

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

  // Get student information from localStorage (applied from /ketquatiemchung)
  const getStudentInfo = (studentId) => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => String(s.studentId) === String(studentId));
    return student
      ? { fullName: student.fullName || student.name || '', className: student.className || '' }
      : { fullName: 'Không xác định', className: 'Không xác định' };
  };


  // Filter events
  const filteredEvents = vaccinationEvents.filter(event => {
    const matchesSearch = !searchText || 
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.vaccineType.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !selectedStatus || event.status === selectedStatus;
    const matchesVaccineType = !selectedVaccineType || event.vaccineType === selectedVaccineType;
    
    let matchesDateRange = true;
    if (dateRange && dateRange.length === 2) {
      const eventDate = dayjs(event.scheduledDate);
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);
      // Check if eventDate is within range (inclusive): startDate <= eventDate <= endDate
      matchesDateRange = (eventDate.isAfter(startDate) || eventDate.isSame(startDate, 'day')) && 
                        (eventDate.isBefore(endDate) || eventDate.isSame(endDate, 'day'));
    }
    
    return matchesSearch && matchesStatus && matchesVaccineType && matchesDateRange;
  });

  // Brief table columns (for initial view)
  const briefColumns = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text strong style={{ fontSize: '14px' }}>{text}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_, record) => {
        const menuItems = [
          {
            key: 'send',
            icon: <BellOutlined />,
            label: 'Gửi thông báo',
            onClick: () => handleSendNotification(record)
          }
        ];

        // Add edit option only for pending campaigns
        if (record.status === 'PENDING') {
          menuItems.unshift({
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Chỉnh sửa',
            onClick: () => navigate('/capnhatthongtintiemchung', { state: { event: record } })
          });
        }

        // Add cancel option for pending campaigns
        if (record.status === 'PENDING') {
          menuItems.push({
            key: 'cancel',
            icon: <CloseCircleOutlined />,
            label: 'Hủy chiến dịch',
            danger: true,
            onClick: () => handleCancel(record)
          });
        }

        if (isAdmin && record.status === 'PENDING') {
          menuItems.unshift({
            key: 'approve',
            icon: <CheckCircleOutlined />,
            label: 'Duyệt chiến dịch',
            onClick: () => handleApprove(record)
          });
        }

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  // Expanded row content (detailed view with new API components)
  const expandedRowRender = (record) => {
    const getOrganizerName = (organizer, record) => {
      return organizer || record.createdBy || 'Y tế trường';
    };

    // Prepare campaign info for components
    const campaignInfo = {
      campaignName: record.title,
      targetGroup: record.targetClass,
      description: record.description,
      scheduledDate: record.scheduledDate,
      status: record.status
    };

    return (
      <Card style={{ margin: '16px 0', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
        {/* Campaign Information Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 16, color: '#52c41a' }}>
            <MedicineBoxOutlined style={{ marginRight: 8 }} />
            Chi tiết chiến dịch: {record.title}
          </Title>
          
          {/* Detailed Information */}
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: '#595959' }}>Mô tả:</Text>
                <br />
                <Text>{record.description || 'Không có mô tả'}</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: '#595959' }}>Loại vắc-xin:</Text>
                <br />
                <Text>{record.vaccineType || 'Không xác định'}</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: '#595959' }}>Ngày tiêm:</Text>
                <br />
                <Text>{record.scheduledDate ? dayjs(record.scheduledDate).format('DD/MM/YYYY') : 'Chưa xác định'}</Text>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: '#595959' }}>Địa điểm:</Text>
                <br />
                <Text>{record.organizer || 'Phòng y tế trường'}</Text>
              </div>
              <div>
                <Text strong style={{ color: '#595959' }}>Đối tượng:</Text>
                <br />
                <Tag icon={<TeamOutlined />} color="purple">
                  {record.targetClass || 'Tất cả'}
                </Tag>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text strong style={{ color: '#595959' }}>Người tổ chức:</Text>
                <br />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  <Text>{getOrganizerName(record.organizer, record)}</Text>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Notes and Required Documents */}
          {record.notes && (
            <div style={{ marginTop: 16, padding: '8px 12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #d9d9d9' }}>
              <Text strong style={{ color: '#595959' }}>Ghi chú:</Text>
              <br />
              <Text>{record.notes}</Text>
            </div>
          )}
          {record.requiredDocuments && (
            <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #d9d9d9' }}>
              <Text strong style={{ color: '#595959' }}>Tài liệu yêu cầu:</Text>
              <br />
              <Text>{record.requiredDocuments}</Text>
            </div>
          )}
        </div>

        <Divider />

        {/* Student Management Section with New APIs */}
        <Tabs
          defaultActiveKey="eligible"
          style={{ marginTop: 16 }}
          items={[
            {
              key: 'eligible',
              label: (
                <span>
                  <TeamOutlined />
                  Học sinh đủ điều kiện
                </span>
              ),
              children: (
                <AllStudentsInCampaign 
                  campaignId={record.id} 
                  campaignInfo={campaignInfo}
                />
              ),
            },
            {
              key: 'status',
              label: (
                <span>
                  <MedicineBoxOutlined />
                  Trạng thái tiêm chủng
                </span>
              ),
              children: (
                <StudentsWithVaccinationStatus 
                  campaignId={record.id} 
                  campaignInfo={campaignInfo}
                />
              ),
            },
          ]}
        />
      </Card>
    );
  };


  // Phân danh sách chiến dịch tiêm chủng thành 3 tab: Chờ phê duyệt, Đã duyệt, Đã hủy
  const eventsByStatus = {
    PENDING: filteredEvents.filter(e => e.status === 'PENDING'),
    APPROVED: filteredEvents.filter(e => e.status === 'APPROVED'),
    CANCELLED: filteredEvents.filter(e => e.status === 'CANCELLED'),
  };

  const tabItems = [
    {
      key: 'PENDING',
      label: 'Chờ phê duyệt',
      children: (
        <Table
          columns={briefColumns}
          dataSource={eventsByStatus.PENDING}
          loading={loading}
          expandable={{ expandedRowRender, expandIcon: ({ expanded, onExpand, record }) => expanded ? (
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ color: '#52c41a' }}>Ẩn chi tiết</Button>
          ) : (
            <Button size="small" type="primary" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>Xem chi tiết</Button>
          ), expandIconColumnIndex: 5, rowExpandable: () => true }}
          pagination={{ total: eventsByStatus.PENDING.length, pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`, }}
          scroll={{ x: 1000 }}
        />
      ),
    },
    {
      key: 'APPROVED',
      label: 'Đã duyệt',
      children: (
        <Table
          columns={briefColumns}
          dataSource={eventsByStatus.APPROVED}
          loading={loading}
          expandable={{ expandedRowRender, expandIcon: ({ expanded, onExpand, record }) => expanded ? (
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ color: '#52c41a' }}>Ẩn chi tiết</Button>
          ) : (
            <Button size="small" type="primary" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>Xem chi tiết</Button>
          ), expandIconColumnIndex: 5, rowExpandable: () => true }}
          pagination={{ total: eventsByStatus.APPROVED.length, pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`, }}
          scroll={{ x: 1000 }}
        />
      ),
    },
    {
      key: 'CANCELLED',
      label: 'Đã hủy',
      children: (
        <Table
          columns={briefColumns}
          dataSource={eventsByStatus.CANCELLED}
          loading={loading}
          expandable={{ expandedRowRender, expandIcon: ({ expanded, onExpand, record }) => expanded ? (
            <Button size="small" type="text" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ color: '#52c41a' }}>Ẩn chi tiết</Button>
          ) : (
            <Button size="small" type="primary" icon={<EyeOutlined />} onClick={e => onExpand(record, e)} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>Xem chi tiết</Button>
          ), expandIconColumnIndex: 5, rowExpandable: () => true }}
          pagination={{ total: eventsByStatus.CANCELLED.length, pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`, }}
          scroll={{ x: 1000 }}
        />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '24px' }}>
      {contextHolder}
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Quản lý tiêm chủng
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: 16, display: 'block', marginTop: 8 }}>
            Quản lý các chiến dịch tiêm chủng và theo dõi phản hồi từ phụ huynh
          </Text>
        </Col>
        {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_NURSE') && (
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate('/taosukientiemchung')}
              style={{ 
                borderRadius: 8,
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
              }}
            >
              Tạo chiến dịch mới
            </Button>
          </Col>
        )}
      </Row>

      {/* Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Tổng chiến dịch"
              value={vaccinationEvents.length}
              prefix={<MedicineBoxOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Chờ phê duyệt"
              value={vaccinationEvents.filter(e => e.status === 'PENDING').length}
              prefix={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Đã duyệt"
              value={vaccinationEvents.filter(e => e.status === 'APPROVED').length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Đã hủy"
              value={vaccinationEvents.filter(e => e.status === 'CANCELLED').length}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card 
        title={
          <Space>
            <FilterOutlined />
            <span>Lọc chiến dịch tiêm chủng</span>
          </Space>
        }
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm theo tên chiến dịch tiêm chủng"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Chọn trạng thái"
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
          {/* <Col xs={24} sm={4}>
            <Select
              placeholder="Chọn loại vắc-xin"
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
          </Col> */}
          <Col xs={24} sm={8}>
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

      {/* Table */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Danh sách chiến dịch tiêm chủng</span>
            <Badge count={filteredEvents.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        style={{ borderRadius: 8 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarGutter={32}
          type="card"
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

      {/* Cancel Campaign Modal */}
      <Modal
        title={<span><ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />Xác nhận hủy chiến dịch</span>}
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        onOk={handleConfirmCancel}
        okText="Hủy chiến dịch"
        okType="danger"
        cancelText="Không"
        confirmLoading={loading}
      >
        <div style={{ marginBottom: 12 }}>
          Bạn có chắc muốn hủy chiến dịch <b>"{cancelTarget?.title}"</b>? Hành động này không thể hoàn tác.
        </div>
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do hủy chiến dịch..."
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
          maxLength={255}
        />
      </Modal>
    </div>
  );
};

export default VaccinationManagement;
