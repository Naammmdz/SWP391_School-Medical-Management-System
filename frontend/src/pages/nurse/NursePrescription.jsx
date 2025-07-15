import React, { useEffect, useState } from 'react';
import { 
  Card, Table, Tag, Button, Popconfirm, message, Space, Typography, 
  Input, Select, Row, Col, Statistic, Badge, Avatar, Image, Modal,
  Descriptions, Divider, Empty, Tooltip, DatePicker, Tabs 
} from 'antd';
import { 
  CheckCircleOutlined, DeleteOutlined, EditOutlined, UserOutlined, 
  TeamOutlined, InfoCircleOutlined, SearchOutlined, FilterOutlined,
  MedicineBoxOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  EyeOutlined, CalendarOutlined, FileImageOutlined, ReloadOutlined,
  CheckOutlined, CloseOutlined, HourglassOutlined
} from '@ant-design/icons';
import MedicineDeclarationService from '../../services/MedicineDeclarationService';
import studentService from '../../services/StudentService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const statusColors = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
  COMPLETED: 'blue',
  EXPIRED: 'default'
};

const statusText = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  COMPLETED: 'Hoàn thành',
  EXPIRED: 'Hết hạn'
};

const MedicineDeclarationsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentClassMap, setStudentClassMap] = useState({});
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isParent = user.userRole === 'ROLE_PARENT';
  const isNurse = user.userRole === 'ROLE_NURSE';

  // Fetch student information to get class names
  const fetchStudentInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await studentService.getAllStudents(config);
      
      if (response.data && Array.isArray(response.data)) {
        const map = {};
        response.data.forEach(student => {
          if (student.studentId && student.className) {
            map[student.studentId] = student.className;
          }
        });
        console.log('Student class map from API:', map);
        setStudentClassMap(prevMap => ({ ...prevMap, ...map }));
}
    } catch (error) {
      console.log('Could not fetch student information:', error);
      // Không hiển thị lỗi cho user vì đây là thông tin bổ sung
    }
  };

  // Lấy thông tin lớp học từ localStorage
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const map = {};
    students.forEach(s => {
      map[s.studentId] = s.className;
    });
    setStudentClassMap(map);
    
    // Cố gắng lấy thêm thông tin từ API
    fetchStudentInfo();
  }, []);

  // Calculate statistics
  const calculateStatistics = (data) => {
    const stats = {
      total: data.length,
      pending: data.filter(item => item.submissionStatus === 'PENDING').length,
      approved: data.filter(item => item.submissionStatus === 'APPROVED').length,
      rejected: data.filter(item => item.submissionStatus === 'REJECTED').length,
      expired: data.filter(item => item.submissionStatus === 'EXPIRED').length
    };
    setStatistics(stats);
  };

  // Sort submissions with pending at the top
  const sortSubmissions = (data) => {
    return [...data].sort((a, b) => {
      // Priority order: PENDING > APPROVED > REJECTED > EXPIRED > COMPLETED
      const statusPriority = {
        'PENDING': 1,
        'APPROVED': 2,
        'REJECTED': 3,
        'EXPIRED': 4,
        'COMPLETED': 5
      };
      
      const aPriority = statusPriority[a.submissionStatus] || 6;
      const bPriority = statusPriority[b.submissionStatus] || 6;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // For items with same status, sort by start date (earlier dates first for pending)
      if (a.submissionStatus === 'PENDING' && b.submissionStatus === 'PENDING') {
        return dayjs(a.startDate).diff(dayjs(b.startDate));
      }
      
      // For other statuses, sort by creation date (if available) or start date
      return dayjs(b.startDate).diff(dayjs(a.startDate));
    });
  };

  // Filter submissions
  const filterSubmissions = (data, search, status, dates, tab) => {
    let filtered = [...data];

    // Filter by tab
    if (tab === 'pending') {
      filtered = filtered.filter(item => item.submissionStatus === 'PENDING');
    } else if (tab === 'approved') {
      filtered = filtered.filter(item => item.submissionStatus === 'APPROVED');
    } else if (tab === 'completed') {
      filtered = filtered.filter(item => 
        ['COMPLETED', 'REJECTED', 'EXPIRED'].includes(item.submissionStatus)
      );
    }
    // For 'all' tab, no status filtering, show all submissions

    // Filter by search text
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => {
        const className = item.className || 
                         item.studentClassName || 
                         studentClassMap[item.studentId] || '';
return item.studentName?.toLowerCase().includes(searchLower) ||
               item.parentName?.toLowerCase().includes(searchLower) ||
               item.instruction?.toLowerCase().includes(searchLower) ||
               className.toLowerCase().includes(searchLower);
      });
    }

    // Filter by status (this is the additional status filter, not tab-based)
    if (status && status !== 'all') {
      filtered = filtered.filter(item => item.submissionStatus === status);
    }

    // Filter by date range
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.startDate);
        return itemDate.isAfter(startDate.subtract(1, 'day')) && 
               itemDate.isBefore(endDate.add(1, 'day'));
      });
    }

    // Sort the filtered results
    const sorted = sortSubmissions(filtered);
    setFilteredSubmissions(sorted);
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await MedicineDeclarationService.getMedicineSubmissions(config);
      const submissions = Array.isArray(data) ? data : [];
      
      // Log để kiểm tra dữ liệu
      console.log('Medicine submissions data:', submissions);
      if (submissions.length > 0) {
        console.log('Sample submission:', submissions[0]);
      }
      
      setSubmissions(submissions);
      calculateStatistics(submissions);
      filterSubmissions(submissions, searchText, statusFilter, dateFilter, activeTab);
    } catch (err) {
      message.error('Không thể tải danh sách đơn thuốc!');
      setSubmissions([]);
      setFilteredSubmissions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter effect
  useEffect(() => {
    filterSubmissions(submissions, searchText, statusFilter, dateFilter, activeTab);
  }, [submissions, searchText, statusFilter, dateFilter, activeTab, studentClassMap]);

  // Cập nhật trạng thái đơn thuốc
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!status) {
        message.error("Trạng thái không hợp lệ!");
        return;
      }
      const payload = {
        submissionStatus: status.toUpperCase(),
        approvedBy: user.id || 0,
        approvedAt: new Date().toISOString().split('T')[0],
      };
      await MedicineDeclarationService.updateMedicineSubmissionStatus(
        id,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success('Cập nhật trạng thái thành công!');
      fetchData();
    } catch (err) {
message.error('Cập nhật trạng thái thất bại!');
    }
  };

  // Xóa đơn thuốc
  const deleteSubmission = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await MedicineDeclarationService.deleteMedicineSubmission(id, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa đơn thuốc thành công!');
      fetchData();
    } catch (err) {
      message.error('Xóa đơn thuốc thất bại!');
    }
  };

  // View submission details
  const viewSubmissionDetails = (record) => {
    setSelectedSubmission(record);
    setDetailModalVisible(true);
  };

  // Get priority color based on status and dates
  const getPriorityColor = (record) => {
    const today = dayjs();
    const startDate = dayjs(record.startDate);
    const endDate = dayjs(record.endDate);
    
    if (record.submissionStatus === 'PENDING' && startDate.diff(today, 'days') <= 1) {
      return '#ff4d4f'; // Red for urgent
    }
    if (record.submissionStatus === 'APPROVED' && endDate.diff(today, 'days') <= 2) {
      return '#fa8c16'; // Orange for expiring soon
    }
    return null;
  };

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => {
        const priorityColor = getPriorityColor(record);
        // Lấy thông tin lớp học từ nhiều nguồn khác nhau
        const className = record.className || 
                         record.studentClassName || 
                         studentClassMap[record.studentId] || 
                         'Không xác định';
        
        return (
          <div style={{ position: 'relative' }}>
            {priorityColor && (
              <div 
                style={{
                  position: 'absolute',
                  left: -8,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: priorityColor,
                  borderRadius: 2
                }}
              />
            )}
            <Space>
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <Text strong style={{ fontSize: 14 }}>{text}</Text>
                <br />
                <Tag color="blue" size="small">
                  {className}
                </Tag>
              </div>
            </Space>
          </div>
        );
      },
      width: 180
    },
    {
      title: 'Phụ huynh',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (text) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<TeamOutlined />} 
            style={{ backgroundColor: '#52c41a' }}
          />
          <Text>{text}</Text>
        </Space>
      ),
      width: 160
    },
    {
      title: 'Hướng dẫn & Thời gian',
key: 'instructionAndDuration',
      render: (_, record) => (
        <div>
          <Paragraph 
            ellipsis={{ rows: 2, tooltip: record.instruction }}
            style={{ margin: 0, fontSize: 13 }}
          >
            <MedicineBoxOutlined style={{ color: '#1890ff', marginRight: 4 }} />
            {record.instruction}
          </Paragraph>
          <div style={{ marginTop: 8 }}>
            <Space size={4}>
              <CalendarOutlined style={{ color: '#52c41a', fontSize: 12 }} />
              <Text style={{ fontSize: 12 }}>
                {dayjs(record.startDate).format('DD/MM')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
              </Text>
              <Tag color="purple" size="small">{record.duration} ngày</Tag>
            </Space>
          </div>
        </div>
      ),
      width: 250
    },
    {
      title: 'Trạng thái',
      dataIndex: 'submissionStatus',
      key: 'submissionStatus',
      render: (status, record) => {
        const today = dayjs();
        const isUrgent = status === 'PENDING' && dayjs(record.startDate).diff(today, 'days') <= 1;
        const isExpiring = status === 'APPROVED' && dayjs(record.endDate).diff(today, 'days') <= 2;
        
        return (
          <div>
            <Badge 
              status={statusColors[status] === 'orange' ? 'warning' : 
                     statusColors[status] === 'green' ? 'success' :
                     statusColors[status] === 'red' ? 'error' : 'default'}
              text={
                <Tag color={statusColors[status]}>
                  {statusText[status]}
                </Tag>
              }
            />
            {isUrgent && (
              <div style={{ marginTop: 4 }}>
                <Tag color="red" size="small">
                  <ExclamationCircleOutlined /> Khẩn cấp
                </Tag>
              </div>
            )}
            {isExpiring && (
              <div style={{ marginTop: 4 }}>
                <Tag color="orange" size="small">
                  <HourglassOutlined /> Sắp hết hạn
                </Tag>
              </div>
            )}
          </div>
        );
      },
      width: 130
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        if (isParent) {
          return (
            <Space direction="vertical" size={4}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                type="link"
                onClick={() => viewSubmissionDetails(record)}
              >
                Xem chi tiết
              </Button>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa đơn thuốc này?"
                onConfirm={() => deleteSubmission(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={record.submissionStatus !== 'PENDING'}
              >
                <Button
icon={<DeleteOutlined />}
                  size="small"
                  type="link"
                  danger
                  disabled={record.submissionStatus !== 'PENDING'}
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        // NURSE/ADMIN
        return (
          <Space direction="vertical" size={4}>
            <Space size={4}>
              <Tooltip title="Phê duyệt đơn thuốc">
                <Button
                  icon={<CheckOutlined />}
                  type="primary"
                  size="small"
                  onClick={() => updateStatus(record.id, 'APPROVED')}
                  disabled={record.submissionStatus !== 'PENDING'}
                  style={{ minWidth: 32 }}
                />
              </Tooltip>
              <Tooltip title="Từ chối đơn thuốc">
                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => updateStatus(record.id, 'REJECTED')}
                  disabled={record.submissionStatus !== 'PENDING'}
                  style={{ minWidth: 32 }}
                />
              </Tooltip>
              <Tooltip title="Xem chi tiết">
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => viewSubmissionDetails(record)}
                  style={{ minWidth: 32 }}
                />
              </Tooltip>
            </Space>
            <Space size={4}>
              {record.submissionStatus === 'APPROVED' && (
                <Button
                  icon={<MedicineBoxOutlined />}
                  size="small"
                  type="link"
                  onClick={() => navigate('/chouongthuoc', { state: { submission: record } })}
                >
                  Ghi nhận
                </Button>
              )}
              <Popconfirm
                title="Bạn chắc chắn muốn xóa đơn thuốc này?"
                onConfirm={() => deleteSubmission(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  type="link"
                  danger
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        );
      },
      width: 120
    }
  ];

  return (
    <div className="medicine-declarations-list-page" style={{ padding: '24px', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <MedicineBoxOutlined style={{ marginRight: 12 }} />
          {isParent ? 'Đơn thuốc của con em' : 'Quản lý đơn thuốc'}
        </Title>
        <Text type="secondary">
{isParent ? 'Theo dõi tình trạng đơn thuốc đã gửi' : 'Duyệt và quản lý đơn thuốc từ phụ huynh'}
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Tổng số đơn"
              value={statistics.total}
              prefix={<MedicineBoxOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Chờ duyệt"
              value={statistics.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Đã duyệt"
              value={statistics.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', borderRadius: 12 }}>
            <Statistic
              title="Từ chối"
              value={statistics.rejected}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm học sinh, phụ huynh, hướng dẫn..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="PENDING">Chờ duyệt</Select.Option>
              <Select.Option value="APPROVED">Đã duyệt</Select.Option>
              <Select.Option value="REJECTED">Từ chối</Select.Option>
              <Select.Option value="EXPIRED">Hết hạn</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
placeholder={['Từ ngày', 'Đến ngày']}
              value={dateFilter}
              onChange={setDateFilter}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchData}
              loading={loading}
              style={{ width: '100%', borderRadius: 8 }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: 'pending',
              label: (
                <span>
                  <ClockCircleOutlined />
                  Chờ duyệt ({statistics.pending})
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredSubmissions.filter(s => s.submissionStatus === 'PENDING')}
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn thuốc`,
                  }}
                  rowKey="id"
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có đơn thuốc chờ duyệt"
                      />
                    )
                  }}
                  rowClassName={(record) => {
                    const today = dayjs();
                    const isUrgent = dayjs(record.startDate).diff(today, 'days') <= 1;
                    return isUrgent ? 'urgent-row' : '';
                  }}
                />
              ),
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined />
                  Đã duyệt ({statistics.approved})
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredSubmissions.filter(s => s.submissionStatus === 'APPROVED')}
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn thuốc`,
                  }}
                  rowKey="id"
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có đơn thuốc đã duyệt"
                      />
                    )
                  }}
                />
              ),
            },
            {
              key: 'completed',
              label: (
                <span>
                  <CheckOutlined />
                  Hoàn thành ({statistics.rejected + statistics.expired})
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredSubmissions.filter(s => 
                    ['REJECTED', 'EXPIRED', 'COMPLETED'].includes(s.submissionStatus)
                  )}
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn thuốc`,
                  }}
                  rowKey="id"
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có đơn thuốc hoàn thành"
                      />
                    )
                  }}
                />
              ),
            },
            {
              key: 'all',
              label: (
                <span>
                  <FilterOutlined />
                  Tất cả ({filteredSubmissions.length})
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredSubmissions}
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} đơn thuốc`,
                  }}
                  rowKey="id"
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không có đơn thuốc nào"
                      />
                    )
                  }}
                  rowClassName={(record) => {
                    const today = dayjs();
                    const isUrgent = record.submissionStatus === 'PENDING' && dayjs(record.startDate).diff(today, 'days') <= 1;
                    return isUrgent ? 'urgent-row' : '';
                  }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#1890ff' }} />
<span>Chi tiết đơn thuốc - {selectedSubmission?.studentName}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedSubmission(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedSubmission?.submissionStatus === 'APPROVED' && isNurse && (
            <Button
              key="log"
              type="primary"
              icon={<MedicineBoxOutlined />}
              onClick={() => {
                setDetailModalVisible(false);
                navigate('/chouongthuoc', { state: { submission: selectedSubmission } });
              }}
            >
              Ghi nhận uống thuốc
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedSubmission && (
          <div>
            <Descriptions
              bordered
              column={2}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Học sinh" span={1}>
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text strong>{selectedSubmission.studentName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Lớp" span={1}>
                <Tag color="blue">{studentClassMap[selectedSubmission.studentId] || '---'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phụ huynh" span={1}>
                <Space>
                  <Avatar icon={<TeamOutlined />} size="small" />
                  <Text>{selectedSubmission.parentName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={1}>
                <Badge
                  status={statusColors[selectedSubmission.submissionStatus] === 'orange' ? 'warning' :
                         statusColors[selectedSubmission.submissionStatus] === 'green' ? 'success' :
                         statusColors[selectedSubmission.submissionStatus] === 'red' ? 'error' : 'default'}
                  text={
                    <Tag color={statusColors[selectedSubmission.submissionStatus]}>
                      {statusText[selectedSubmission.submissionStatus]}
                    </Tag>
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu" span={1}>
                <Text>{dayjs(selectedSubmission.startDate).format('DD/MM/YYYY')}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc" span={1}>
                <Text>{dayjs(selectedSubmission.endDate).format('DD/MM/YYYY')}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian sử dụng" span={2}>
<Tag color="purple">{selectedSubmission.duration} ngày</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hướng dẫn sử dụng" span={2}>
                <Paragraph style={{ margin: 0 }}>
                  {selectedSubmission.instruction}
                </Paragraph>
              </Descriptions.Item>
              {selectedSubmission.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  <Paragraph style={{ margin: 0 }} type="secondary">
                    {selectedSubmission.notes}
                  </Paragraph>
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedSubmission.imageData && (
              <div>
                <Divider orientation="left">
                  <Space>
                    <FileImageOutlined />
                    <Text strong>Hình ảnh đơn thuốc</Text>
                  </Space>
                </Divider>
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={selectedSubmission.imageData}
                    alt="Đơn thuốc"
                    style={{ maxWidth: '100%', borderRadius: 8 }}
                    placeholder
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .urgent-row {
          background-color: #fff2f0;
          border-left: 4px solid #ff4d4f;
        }
        .urgent-row:hover {
          background-color: #fff1f0 !important;
        }
      `}</style>
    </div>
  );
};

export default MedicineDeclarationsList;
