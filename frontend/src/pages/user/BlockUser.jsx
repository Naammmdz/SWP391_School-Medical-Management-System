import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spin, Typography, Space, Row, Col, Descriptions } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/UserService';
import './BlockUser.css';

const { Title, Text } = Typography;

const BlockUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers({
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const foundUser = response.data.find(u => u.id === parseInt(userId));
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('Không tìm thấy người dùng');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
    setLoading(false);
  };

  // Block user
  const blockUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await userService.deleteUser(userId, {
        params: { isActive: false },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Vô hiệu hóa người dùng thành công!');
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/danhsachnguoidung');
      }, 2000);
    } catch (error) {
      setError('Failed to block user');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải dữ liệu...</Text>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, marginTop: 50 }}>
        <Alert
          message="Không tìm thấy người dùng"
          type="error"
          showIcon
          style={{ borderRadius: 12 }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ef4444' }}>
            <StopOutlined style={{ marginRight: 12 }} />
            Vô hiệu hóa người dùng
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

      {/* User Info Card */}
      <Card
        style={{ 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)', 
          marginBottom: 32
        }}
        title={
          <Space>
            <UserOutlined style={{ color: '#15803d' }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: '#15803d' }}>
              Thông tin người dùng
            </span>
          </Space>
        }
      >
        <Descriptions column={1} size="large">
          <Descriptions.Item label="Họ và tên">
            <Text strong>{user.fullName}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái hiện tại">
            <Text type={user.isActive ? 'success' : 'danger'}>
              {user.isActive === true || user.isActive === "true"
                ? "Đang hoạt động"
                : "Ngừng hoạt động"}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Confirmation Card */}
      <Card
        style={{ 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)', 
          borderColor: '#ff4d4f'
        }}
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: '#ff4d4f' }}>
              Xác nhận vô hiệu hóa
            </span>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Text style={{ fontSize: 16, marginBottom: 24, display: 'block' }}>
            Bạn có chắc chắn muốn vô hiệu hóa người dùng này?
          </Text>
          <Text type="secondary" style={{ fontSize: 14, marginBottom: 32, display: 'block' }}>
            Hành động này sẽ ngừng kích hoạt tài khoản của người dùng.
          </Text>
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
              danger
              onClick={blockUser}
              icon={<StopOutlined />}
              size="large"
              style={{ borderRadius: 8, minWidth: 160 }}
            >
              Xác nhận vô hiệu hóa
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default BlockUser;
