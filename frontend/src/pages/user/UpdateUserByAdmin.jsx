import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Spin, Typography, Space, Row, Col, message } from 'antd';
import { SaveOutlined, CloseOutlined, UserOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/UserService';
import './UpdateUserByAdmin.css';

const { Title, Text } = Typography;

const UpdateUserByAdmin = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    fullName: '',
    phone: '',
    email: '',
    isActive: ''
  });

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const user = response.data.find(u => u.id === parseInt(userId));
      if (user) {
        setCurrentUser({
          id: user.id,
          fullName: user.fullName || '',
          phone: user.phone || '',
          email: user.email || '',
          isActive: user.isActive
        });
      } else {
        setError('Không tìm thấy người dùng');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  // Update user
  const updateUser = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const updateRequest = {};
      if (values.fullName) updateRequest.fullName = values.fullName;
      if (values.email) updateRequest.email = values.email;
      if (values.phone) updateRequest.phone = values.phone;

      await userService.updateUser(currentUser.id, updateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Cập nhật người dùng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/danhsachnguoidung');
      }, 2000);
    } catch (error) {
      setError('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    form.setFieldsValue(currentUser);
  }, [currentUser, form]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <EditOutlined style={{ marginRight: 12 }} />
            Chỉnh sửa thông tin người dùng
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
        <Form form={form} layout="vertical" onFinish={updateUser} initialValues={currentUser}>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Họ và tên" name="fullName" required>
                <Input
                  size="large"
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Số điện thoại" name="phone" required>
                <Input
                  size="large"
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Email" name="email" required>
                <Input
                  size="large"
                  placeholder="Nhập email"
                  prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ borderRadius: 8 }}
                  required
                />
              </Form.Item>
            </Col>
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
          </Row>

          <Row justify="center" style={{ marginTop: 32 }}>
            <Col>
              <Space size={16}>
                <Button
                  onClick={() => navigate('/danhsachnguoidung')}
                  icon={<CloseOutlined />}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120 }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ borderRadius: 8, minWidth: 120 }}
                >
                  Cập nhật
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateUserByAdmin;
