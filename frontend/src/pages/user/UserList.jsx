import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Spin, Typography, Space, Row, Col, message, Table, Tag, Select, Modal, Tooltip } from 'antd';
import { 
  UserOutlined,
  SearchOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  UserAddOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import './UserList.css';
import studentService from '../../services/StudentService';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const roles = [
  { value: '', label: 'Vai trò' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'NURSE', label: 'Nhân viên y tế' },
  { value: 'PARENT', label: 'Phụ huynh' },
  { value: 'PRINCIPAL', label: 'Hiệu trưởng' }
];

const sortOptions = [
 
  { value: 'role,asc', label: 'Vai trò (A-Z)' },
  { value: 'role,desc', label: 'Vai trò (Z-A)' }
];

const statusOptions = [
  { value: '', label: 'Trạng thái' },
  { value: 'true', label: 'Đang hoạt động' },
  { value: 'false', label: 'Ngừng hoạt động' }
];

const PAGE_SIZE = 10;

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filter states
  const [filter, setFilter] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    isActive: '',
   
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users from API with filters and pagination
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = {
        ...filter,
        page,
        size: PAGE_SIZE,
         sort: 'createdAt,desc'
      };
      // Remove empty params
      Object.keys(params).forEach(
        (key) => (params[key] === '' || params[key] === undefined) && delete params[key]
      );
      // Convert isActive to boolean if needed
      if (params.isActive === 'true') params.isActive = true;
      if (params.isActive === 'false') params.isActive = false;

      const response = await userService.getAllUsers({
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Nếu backend trả về mảng, tự tính tổng trang
      setUsers(response.data);
      
      localStorage.setItem('users', JSON.stringify(response.data));
      
      if (Array.isArray(response.data)) {
        setTotalPages(response.data.length < PAGE_SIZE ? page + 1 : page + 2); // Ước lượng, nên backend trả về tổng số trang
      } else if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };
 
  // Delete (vô hiệu hóa) user
  const deleteUser = async (id) => {
    setUserToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await userService.deleteUser(userToDelete, {
        params: { isActive: false },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(users.map(user =>
        user.id === userToDelete ? { ...user, isActive: false } : user
      ));
      setShowConfirmModal(false);
      setUserToDelete(null);
      setSuccessMessage('Vô hiệu hóa người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError('Failed to disable user');
    }
  };

  // Navigate to update user
  const navigateToUpdateUser = (userId) => {
    navigate(`/capnhatnguoidung/${userId}`);
  };

  // Navigate to block user
  const navigateToBlockUser = (userId) => {
    navigate(`/khoanguoidung/${userId}`);
  };
  const navigateToCreateUser = () => {
    navigate('/taomoinguoidung');
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset page when filter changes
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setFilter({
      fullName: '',
      email: '',
      phone: '',
      role: '',
      isActive: '',
      
    });
    setPage(0);
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page]);

  // Listen for navigation back to this page to refresh data
  useEffect(() => {
    const handleFocus = () => {
      // Refresh data when user navigates back to this page
      fetchUsers();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

   return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <TeamOutlined style={{ marginRight: 12 }} />
            Danh sách người dùng
          </Title>
        </Col>
        <Col>
          <Space>
            {user.userRole === 'ROLE_ADMIN' && (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                size="large"
                onClick={navigateToCreateUser}
                style={{ borderRadius: 8 }}
              >
                Thêm người dùng
              </Button>
            )}
            {user.userRole === 'ROLE_PARENT' && (
              <Button
                type="default"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate('/taomoihocsinh')}
                style={{ borderRadius: 8 }}
              >
                Thêm học sinh
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      {/* Filter Form */}
      <Card
        style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0, color: '#15803d' }}>
            <SearchOutlined style={{ marginRight: 8 }} />
            Tìm kiếm và lọc người dùng
          </Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Họ và tên"
                value={filter.fullName}
                onChange={(e) => setFilter(prev => ({ ...prev, fullName: e.target.value }))}
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Email"
                value={filter.email}
                onChange={(e) => setFilter(prev => ({ ...prev, email: e.target.value }))}
                prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Số điện thoại"
                value={filter.phone}
                onChange={(e) => setFilter(prev => ({ ...prev, phone: e.target.value }))}
                prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Chọn vai trò"
                value={filter.role || undefined}
                onChange={(value) => setFilter(prev => ({ ...prev, role: value || '' }))}
                style={{ width: '100%', borderRadius: 8 }}
                size="large"
                allowClear
              >
                {roles.slice(1).map(role => (
                  <Option key={role.value} value={role.value}>{role.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Chọn trạng thái"
                value={filter.isActive || undefined}
                onChange={(value) => setFilter(prev => ({ ...prev, isActive: value || '' }))}
                style={{ width: '100%', borderRadius: 8 }}
                size="large"
                allowClear
              >
                {statusOptions.slice(1).map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleFilterSubmit}
                  style={{ borderRadius: 8 }}
                  size="large"
                >
                  Tìm kiếm
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilter}
                  style={{ borderRadius: 8 }}
                  size="large"
                >
                  Xóa lọc
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* Users table */}
      <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
        <Table 
          dataSource={users}
          loading={loading}
          rowKey={(record) => record.id}
          locale={{
            emptyText: 'Không có người dùng nào trong hệ thống.'
          }}
          columns={[
            {
              title: 'Họ và tên',
              dataIndex: 'fullName',
              key: 'fullName',
              render: (text) => <strong style={{ color: '#2563eb' }}>{text}</strong>
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'phone',
              key: 'phone',
              render: (text) => text || '-',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              render: (text) => text || '-',
            },
            {
              title: 'Trạng thái',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive) => (
                <Tag color={isActive ? 'green' : 'volcano'}>
                  {isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Tag>
              ),
            },
            {
              title: 'Vai trò',
              dataIndex: 'role',
              key: 'role',
              render: (role) => {
                const roleData = roles.find(r => r.value === role);
                return roleData ? <Tag color="blue">{roleData.label}</Tag> : '-';
              }
            },
            {
              title: 'Thao tác học sinh',
              key: 'action_student',
              render: (text, record) => (
                (record.role === 'PARENT' || record.role === 'ROLE_PARENT') && (
                  <Button 
                    type="link" 
                    icon={<UserAddOutlined />} 
                    onClick={() => navigate('/taomoihocsinh', { state: { parentId: record.id } })}
                  >
                    Thêm học sinh
                  </Button>
                )
              ),
            },
            {
              title: 'Hành động',
              key: 'action',
              render: (text, record) => (
                <Space size="middle">
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => navigateToUpdateUser(record.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Vô hiệu hóa">
                    <Button
                      type="danger"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => navigateToBlockUser(record.id)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          pagination={{
            current: page + 1,
            pageSize: PAGE_SIZE,
            total: totalPages * PAGE_SIZE,
            onChange: (page) => setPage(page - 1),
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`
          }}
        />
      </Card>

      {/* Custom Confirmation Modal */}
      <Modal 
        title="Xác nhận vô hiệu hóa" 
        open={showConfirmModal} 
        onOk={handleConfirmDelete} 
        onCancel={() => setShowConfirmModal(false)} 
        okText="Xác nhận" 
        cancelText="Hủy" 
        okType="danger"
      >
        <p>Bạn có chắc chắn muốn vô hiệu hóa người dùng này?</p>
      </Modal>
    </div>
  );
};

export default UserList;