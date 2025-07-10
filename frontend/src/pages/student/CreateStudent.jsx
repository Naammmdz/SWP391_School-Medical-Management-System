import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Alert, Spin, Avatar, Typography, Row, Col, message, DatePicker } from 'antd';
import { UserAddOutlined, SaveOutlined, UserOutlined, CalendarOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import userService from '../../services/UserService';
import studentService from '../../services/StudentService';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './CreateStudent.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateStudent = () => {
  const location = useLocation();
  const parentId = location.state?.parentId || '';
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Lấy thông tin phụ huynh từ parentId
  useEffect(() => {
    const fetchParent = async () => {
      if (!parentId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await userService.getParentId(parentId, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParent(res.data);
      } catch (err) {
        message.error('Không tìm thấy thông tin phụ huynh!');
      }
      setLoading(false);
    };
    fetchParent();
  }, [parentId]);

  // Tạo mới học sinh
  const handleSubmit = async (values) => {
    if (!parentId) {
      message.error('Không xác định được phụ huynh!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const createRequest = {
        ...values,
        // Convert date to proper format - backend expects yob field
        yob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        parentId
      };
      // Remove dob field to avoid confusion
      delete createRequest.dob;
      await studentService.createStudent(createRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      message.success('Tạo học sinh thành công!');
      form.resetFields();
      // Redirect to student list
      window.location.href = '/danhsachhocsinh';

    } catch (err) {
      message.error('Tạo học sinh thất bại!');
    }
    setLoading(false);
  };

  if (loading && !parent) {
    return (
      <div className="create-student-loading">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="create-student-page">
      <Card className="create-student-header-card">
        <div className="header-content">
          <Avatar size={48} icon={<UserAddOutlined />} className="header-avatar" />
          <div className="header-text">
            <Title level={2} className="header-title">
              Tạo mới học sinh
            </Title>
            <Text className="header-description">
              Thêm thông tin học sinh mới vào hệ thống
            </Text>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="form-card" title="Thông tin học sinh" extra={<UserOutlined />}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              className="student-form"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><UserOutlined /> Họ và tên</span>}
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input
                      placeholder="Nhập họ và tên học sinh"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><CalendarOutlined /> Ngày sinh</span>}
                    name="dob"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày sinh"
                      size="large"
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => {
                        // Disable future dates and dates before 1900
                        return current && (current > dayjs().endOf('day') || current < dayjs('1900-01-01'));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><TeamOutlined /> Giới tính</span>}
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select placeholder="Chọn giới tính" size="large">
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><BookOutlined /> Lớp</span>}
                    name="className"
                    rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
                  >
                    <Input
                      placeholder="Nhập tên lớp"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  icon={<SaveOutlined />}
                  className="submit-btn"
                >
                  Tạo học sinh
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="parent-info-card" title="Thông tin phụ huynh">
            {parent ? (
              <div className="parent-info">
                <Avatar size={64} icon={<UserOutlined />} className="parent-avatar" />
                <div className="parent-details">
                  <Title level={4} className="parent-name">{parent.fullName}</Title>
                  <Text className="parent-email">{parent.email}</Text>
                  <Text className="parent-phone">{parent.phoneNumber}</Text>
                </div>
              </div>
            ) : (
              <div className="no-parent">
                <Text type="secondary">Chưa có thông tin phụ huynh</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateStudent;