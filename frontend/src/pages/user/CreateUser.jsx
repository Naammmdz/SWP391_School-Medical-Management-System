import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Space, Row, Col, Select } from 'antd';
import { PlusOutlined, CloseOutlined, SaveOutlined, UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import userService from '../../services/UserService';
import './CreateUser.css';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const CreateUser = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    phone: '',
    role: '',
    email: '',
    isActive: '',
    password: ''
  });

  // Available roles
  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'NURSE', label: 'Nhân viên y tế' },
    { value: 'PARENT', label: 'Phụ huynh' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Create new user (register)
  const createUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const registerRequest = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role
      };

      await userService.createUser(registerRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      resetForm();
      setSuccessMessage('Tạo người dùng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/danhsachnguoidung'); // hoặc đường dẫn UserList của bạn
      }, 2000);
    } catch (error) {
      setError('Failed to create user');
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    try {
      const token = localStorage.getItem('token');
      const updateRequest = {};
      if (userData.fullName) updateRequest.fullName = userData.fullName;
      if (userData.email) updateRequest.email = userData.email;
      if (userData.phone) updateRequest.phone = userData.phone;

      await userService.updateUser(id, updateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => setSuccessMessage(null), 2000);
      resetForm();
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Handle form submission
  const handleSubmit = (values) => {
    // When using Ant Design Form, onFinish receives form values, not DOM event
    // We'll use currentUser state since it's already being maintained
    if (isEditing) {
      if (!currentUser.fullName || !currentUser.phone || !currentUser.email) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      updateUser(currentUser.id, currentUser);
    } else {
      if (!currentUser.fullName || !currentUser.phone || !currentUser.role || !currentUser.email || !currentUser.password) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }
      createUser(currentUser);
    }
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser({
      id: null,
      fullName: '',
      phone: '',
      role: '',
      email: '',
      isActive: '',
      password: ''
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <UserAddOutlined style={{ marginRight: 12 }} />
            {isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </Title>
        </Col>
      </Row>

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

      <Card
        style={{ 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)', 
          marginBottom: 32
        }}
        bodyStyle={{ padding: 32 }}
        title={
          <Space>
            <UserOutlined style={{ color: '#15803d' }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: '#15803d' }}>
              Thông tin người dùng
            </span>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Họ và tên" required>
                <Input
                  name="fullName"
                  value={currentUser.fullName}
                  onChange={handleInputChange}
                  size="large"
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Số điện thoại" required>
                <Input
                  name="phone"
                  value={currentUser.phone}
                  onChange={handleInputChange}
                  size="large"
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Email" required>
                <Input
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  size="large"
                  placeholder="Nhập email"
                  prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
            {!isEditing && (
              <Col xs={24} sm={12}>
                <Form.Item label="Vai trò" required>
                  <Select
                    name="role"
                    value={currentUser.role || undefined}
                    onChange={(value) => setCurrentUser(prev => ({ ...prev, role: value }))}
                    size="large"
                    placeholder="Chọn vai trò"
                    style={{ borderRadius: 8 }}
                    required
                  >
                    {roles.map(role => (
                      <Option key={role.value} value={role.value}>
                        {role.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            {!isEditing && (
              <Col xs={24} sm={12}>
                <Form.Item label="Mật khẩu" required>
                  <Input.Password
                    name="password"
                    value={currentUser.password}
                    onChange={handleInputChange}
                    size="large"
                    placeholder="Nhập mật khẩu"
                    prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
                    style={{ borderRadius: 8 }}
                    required
                  />
                </Form.Item>
              </Col>
            )}
            {isEditing && (
              <Col xs={24} sm={12}>
                <Form.Item label="Trạng thái">
                  <Input
                    value={
                      currentUser.isActive === true || currentUser.isActive === "true"
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"
                    }
                    size="large"
                    style={{ borderRadius: 8 }}
                    disabled
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row justify="center" style={{ marginTop: 32 }}>
            <Col>
              <Space size={16}>
                <Button
                  onClick={resetForm}
                  icon={<CloseOutlined />}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120 }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120 }}
                >
                  {isEditing ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
